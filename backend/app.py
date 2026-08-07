# -*- coding: utf-8 -*-
"""
熔智淬新 · 知识图谱后端（竞赛演示用，轻量 Flask + SQLite）
- 托管 site/ 全部静态前端（index/kg/vision/... 原样不动）
- GET  /api/kg       公开：返回知识图谱全量数据（实体/关系/砖型参数/工位知识库）
- POST /api/kg       管理员登录后：新增一个知识节点（砖型自动写参数表）
- GET  /admin/login  管理员登录页
- GET  /admin         后台（列出实体 + 发布新节点表单）
- GET  /admin/logout  退出
首次运行自动建库并导入 kg_seed.json 种子数据。
"""
import os, json, sqlite3, uuid
from flask import (Flask, request, redirect, url_for, session,
                   render_template, send_from_directory, jsonify)
from flask_cors import CORS  # 分离部署：允许前端静态站跨域访问 /api/*

BASE = os.path.dirname(os.path.abspath(__file__))
SEED_PATH = os.path.join(BASE, 'kg_seed.json')
DB_PATH = os.path.join(BASE, 'kg.db')

# 分离部署：后端只提供 API + 后台，不再托管前端静态文件
app = Flask(__name__, static_folder=None)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # 允许任意前端域名跨域读取知识图谱
app.secret_key = os.environ.get('SECRET_KEY', 'rzzx-dev-secret-please-change')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'linzuyan2007')

# 节点类型 → 中文标签（与前端 typeQueries 一致）
TYPE_LABELS = {1: '砖型', 2: '缺陷', 3: '工位', 4: '成因', 5: '方案', 6: '参数', 7: '设备', 8: '案例'}


# ---------------- 数据库 ----------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    c = conn.cursor()
    c.executescript('''
    CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY, type INTEGER, name TEXT,
        aliases TEXT, attrs TEXT, detail TEXT
    );
    CREATE TABLE IF NOT EXISTS relations (
        source TEXT, rel TEXT, target TEXT, weight REAL
    );
    CREATE TABLE IF NOT EXISTS params (
        brick_id TEXT PRIMARY KEY, dryTemp TEXT, dryTime TEXT,
        sinterTemp TEXT, sinterTime TEXT, pressPressure TEXT, coolRate TEXT
    );
    CREATE TABLE IF NOT EXISTS stations (
        station_id TEXT PRIMARY KEY, func TEXT, params TEXT, defects TEXT, opt TEXT
    );
    ''')
    # 首次运行：从种子导入
    if c.execute('SELECT COUNT(*) FROM entities').fetchone()[0] == 0:
        with open(SEED_PATH, 'r', encoding='utf-8') as f:
            seed = json.load(f)
        for e in seed['entities']:
            c.execute(
                'INSERT OR REPLACE INTO entities (id,type,name,aliases,attrs,detail) VALUES (?,?,?,?,?,?)',
                (e['id'], e['type'], e['name'],
                 json.dumps(e.get('aliases', []), ensure_ascii=False),
                 json.dumps(e['attrs'], ensure_ascii=False) if 'attrs' in e else None,
                 e.get('detail')))
        for r in seed['relations']:
            c.execute('INSERT INTO relations (source,rel,target,weight) VALUES (?,?,?,?)', tuple(r))
        for bid, p in seed['paramDB'].items():
            c.execute(
                'INSERT OR REPLACE INTO params VALUES (?,?,?,?,?,?,?)',
                (bid, p.get('dryTemp'), p.get('dryTime'), p.get('sinterTemp'),
                 p.get('sinterTime'), p.get('pressPressure'), p.get('coolRate')))
        for sid, s in seed['STATION_KB'].items():
            c.execute(
                'INSERT OR REPLACE INTO stations VALUES (?,?,?,?,?)',
                (sid, s.get('func'),
                 json.dumps(s.get('params', []), ensure_ascii=False),
                 json.dumps(s.get('defects', []), ensure_ascii=False),
                 json.dumps(s.get('opt', []), ensure_ascii=False)))
        conn.commit()
        print('[init_db] 已从种子导入知识图谱数据')
    conn.close()


def serialize_kg():
    conn = get_db()
    c = conn.cursor()
    entities = []
    for row in c.execute('SELECT id,type,name,aliases,attrs,detail FROM entities'):
        e = {'id': row['id'], 'type': row['type'], 'name': row['name'],
             'aliases': json.loads(row['aliases'] or '[]')}
        if row['attrs']:
            e['attrs'] = json.loads(row['attrs'])
        if row['detail']:
            e['detail'] = row['detail']
        entities.append(e)
    relations = [list(r) for r in c.execute('SELECT source,rel,target,weight FROM relations')]
    paramDB = {}
    for row in c.execute('SELECT * FROM params'):
        paramDB[row['brick_id']] = {
            'dryTemp': row['dryTemp'], 'dryTime': row['dryTime'],
            'sinterTemp': row['sinterTemp'], 'sinterTime': row['sinterTime'],
            'pressPressure': row['pressPressure'], 'coolRate': row['coolRate']}
    STATION_KB = {}
    for row in c.execute('SELECT * FROM stations'):
        STATION_KB[row['station_id']] = {
            'func': row['func'],
            'params': json.loads(row['params'] or '[]'),
            'defects': json.loads(row['defects'] or '[]'),
            'opt': json.loads(row['opt'] or '[]')}
    conn.close()
    return {'entities': entities, 'relations': relations,
            'paramDB': paramDB, 'STATION_KB': STATION_KB}


# ---------------- 路由 ----------------
@app.route('/')
def index():
    # 分离部署下后端不托管前端；根路径返回健康检查，便于确认服务存活
    return jsonify({'service': 'rongzhi-cuixin-kg-api', 'status': 'ok'})


@app.route('/api/kg', methods=['GET', 'POST'])
def api_kg():
    if request.method == 'GET':
        return jsonify(serialize_kg())
    # POST：新增节点（需管理员登录）
    if not session.get('admin'):
        return jsonify({'ok': False, 'msg': '未登录或登录已过期'}), 401
    data = request.get_json(force=True, silent=True) or {}
    try:
        etype = int(data.get('type', 1))
        name = (data.get('name') or '').strip()
        if not name:
            return jsonify({'ok': False, 'msg': '名称不能为空'}), 400
        aliases = data.get('aliases')
        if isinstance(aliases, str):
            aliases = [a.strip() for a in aliases.split(',') if a.strip()]
        elif not isinstance(aliases, list):
            aliases = []
        detail = (data.get('detail') or '').strip() or None
        attrs = data.get('attrs') or None
        eid = 'u' + uuid.uuid4().hex[:8]
        conn = get_db()
        c = conn.cursor()
        c.execute(
            'INSERT INTO entities (id,type,name,aliases,attrs,detail) VALUES (?,?,?,?,?,?)',
            (eid, etype, name, json.dumps(aliases, ensure_ascii=False),
             json.dumps(attrs, ensure_ascii=False) if attrs else None, detail))
        # 砖型：写入参数表
        if etype == 1 and data.get('params'):
            p = data['params']
            c.execute(
                'INSERT OR REPLACE INTO params VALUES (?,?,?,?,?,?,?)',
                (eid, p.get('dryTemp'), p.get('dryTime'), p.get('sinterTemp'),
                 p.get('sinterTime'), p.get('pressPressure'), p.get('coolRate')))
        conn.commit()
        conn.close()
        return jsonify({'ok': True, 'id': eid, 'msg': '已发布：' + name})
    except Exception as ex:
        return jsonify({'ok': False, 'msg': '发布失败：' + str(ex)}), 500


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        pw = request.form.get('password', '')
        if pw == ADMIN_PASSWORD:
            session['admin'] = True
            return redirect(url_for('admin_home'))
        return render_template('admin_login.html', error='密码错误，请重试')
    return render_template('admin_login.html', error=None)


@app.route('/admin')
def admin_home():
    if not session.get('admin'):
        return redirect(url_for('admin_login'))
    kg = serialize_kg()
    return render_template('admin.html',
                           entities=kg['entities'],
                           type_labels=TYPE_LABELS)


@app.route('/admin/logout')
def admin_logout():
    session.pop('admin', None)
    return redirect(url_for('admin_login'))


# ---------------- 启动 ----------------
if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
