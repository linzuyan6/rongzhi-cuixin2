# 给 Qoder 的部署提示词（修正版，可直接复制粘贴）

> 下面这段是交给阿里 Qoder 的话术。已根据你真实代码情况修正（原提示词里"端口未适配""代码本就分离"等前提不成立，本包已处理）。直接把这段 + 本目录一起给 Qoder 即可。

---

我是参赛项目「熔智淬新」的负责人，已完成一个 Flask + SQLite 知识图谱后端和一套纯静态前端。代码已按"前后端分离"整理好，放在当前目录 `Qoder部署材料/` 下，结构如下：

- `backend/`：Flask 后端（app.py + requirements.txt + kg_seed.json + templates/），提供 `/api/kg` 接口和管理员后台 `/admin`
- `frontend/`：纯静态前端（index.html / kg.html / 等 HTML + style.css + app.js + config.js）
- `render.yaml`：一个仓库定义「后端 Web Service」+「前端 Static Site」两个服务的配置

**请不要帮我重写业务代码，只做部署适配、配置文件生成、排错指导。** 按以下阶段执行：

**阶段1｜推代码到 GitHub**
把 `Qoder部署材料/` 整个目录作为仓库根内容推到 GitHub（新建仓库或覆盖旧仓库均可）。注意 `backend/.gitignore` 已忽略 `kg.db`，不要提交数据库文件。

**阶段2｜Render 部署（读 render.yaml）**
在 Render 连接该 GitHub 仓库，选择「Blueprint / 读取 render.yaml」，一次性创建两个服务：
- 后端 `rongzhi-cuixin-backend`：Web Service，Python，Free；Build=`pip install -r requirements.txt`，Start=`python app.py`
- 前端 `rongzhi-cuixin-frontend`：Static Site，Free；`staticPublishPath: .`
后端环境变量设 `ADMIN_PASSWORD=linzuyan2007`、`SECRET_KEY=<随机串>`（PORT 由平台自动注入，app.py 已读 `$PORT`，不要写死）。

**阶段3｜填后端地址到前端**
后端部署完成后，拿到后端域名（形如 `https://rongzhi-cuixin-backend.onrender.com`）。修改 `frontend/config.js` 里的 `window.API_BASE = ''` 为后端真实地址（结尾不要带斜杠），然后把前端重新推一次 GitHub 触发重新部署。
（说明：`frontend/kg.html` 里接口调用已写成 `fetch((window.API_BASE||'') + '/api/kg')`，后端 `app.py` 已用 Flask-Cors 放开 `/api/*` 跨域，所以这里只需填地址即可，无需再改其它代码。）

**阶段4｜验证**
- 后端根路径返回 `{"service":"rongzhi-cuixin-kg-api","status":"ok"}`
- 后端 `/api/kg` 返回 JSON（含 entities/relations/paramDB）
- 前端 `kg.html` 输入"莫来石"能匹配出"高纯莫来石定型砖"
- 后台 `/admin/login` 密码 `linzuyan2007` 能登录

**阶段5｜排错（出现以下问题时逐步排查日志）**
- 构建失败：看 Build 日志确认 Flask / Flask-Cors 安装成功
- 启动失败 / 端口报错：确认 Start=`python app.py` 且 app.py 读 `$PORT`
- 接口 404：确认访问的是后端域名下的 `/api/kg`
- 跨域 CORS 报错：确认后端 CORS 已开、前端 `config.js` 的 `API_BASE` 已填真实后端地址且结尾无斜杠
- 登录失败：确认 Render 环境变量 `ADMIN_PASSWORD` 已设；session 过期则重新登录

**约束**：不要操作浏览器登录，只给我代码修改方案和操作步骤。遇到阻塞把 Render 的报错日志贴回来，我来判断。

---

> 备注：你最初写的提示词里「任务1 修改端口适配 $PORT」在本包中已完成（app.py 已读 `$PORT`），「前后端分离」也已在打包时拆好。Qoder 实际只需做：推 GitHub → 连 Render 读 yaml → 填前端 API_BASE → 验证。
