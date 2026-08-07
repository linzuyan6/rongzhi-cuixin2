/* ============================================================
   熔智淬新 · 共享交互逻辑（原 demo 能力平移，不阉割）
   各页面通过 <script src="app.js"> 引入，再按需调用对应 init。
   ============================================================ */

/* ===== LANGUAGE (Hero only) ===== */
var _zhHomeLead='';
function setLang(l){
  var el=document.getElementById('homeLead'); if(!el)return;
  if(!_zhHomeLead)_zhHomeLead=el.innerHTML;
  var texts={
    en:'Refractory is a traditional industry defined by high temperature, high risk and high energy use. Legacy lines rely on manual inspection — high miss rates, kiln runaway risk, heavy emissions. Rongzhi Cuixin’s edge: <b style="color:#f59e0b">fusing vision-ultrasound sensing, a knowledge-graph brain and self-iterating parameters</b> into a four-step AI evolution engine that rebuilds the whole line into a self-improving system — removing people from hazardous posts and driving toward the optimal process. Via <b style="color:#2563eb">Macau’s "1+4" economy and Portuguese-speaking platform</b>, we export this Chinese refractory AI standard to Lusophone countries.',
    pt:'O material refratário é uma indústria tradicional marcada por alta temperatura, alto risco e alto consumo de energia. As linhas antigas dependem de inspeção manual — taxas de falha elevadas, risco de descontrolo do forno, fortes emissões. O diferencial da Rongzhi Cuixin: <b style="color:#f59e0b">fundir a deteção visão-ultrassom, um "cérebro" de grafo de conhecimento e parâmetros auto-iterativos</b> num motor de evolução de IA de quatro passos que reconstrói toda a linha num sistema que melhora sozinho. Através da <b style="color:#2563eb">economia "1+4" de Macau e da plataforma lusófona</b>, exportamos esta norma chinesa de IA para os países de língua portuguesa.',
    yue:'耐材係典型嘅「高溫、高危、高耗能」傳統產業——舊生產線長期靠人手目檢同師傅經驗控製，漏檢率高、窯爐失控風險大、能耗同碳排放居高唔下。熔智淬新嘅核心優勢，係將<b style="color:#f59e0b">視聲融合感知、知識圖譜推理、參數自迭代</b>三環打通，組成一套四步 AI 自進化引擎，將由碎料到檢包嘅全鏈路重塑成會自動進化嘅工藝系統。靠<b style="color:#2563eb">澳門「1+4」多元經濟同中葡平台支點</b>，我哋將呢套中國耐材 AI 工藝標準輸出到葡語國家。'
  };
  if(l==='zh')el.innerHTML=_zhHomeLead; else if(texts[l])el.innerHTML=texts[l];
  document.querySelectorAll('.lang button').forEach(function(b){
    var oc=b.getAttribute('onclick')||''; b.classList.toggle('active',oc.indexOf("'"+l+"'")>=0);
  });
}

/* ===== ROI CALCULATOR ===== */
function calcROI(){
  var lines=+document.getElementById('sLines').value;
  var workers=+document.getElementById('sWorkers').value;
  var defect=+document.getElementById('sDefect').value;
  var energy=+document.getElementById('sEnergy').value;
  var output=+document.getElementById('sOutput').value;
  document.getElementById('vLines').textContent=lines;
  document.getElementById('vWorkers').textContent=workers;
  document.getElementById('vDefect').textContent=defect+'%';
  document.getElementById('vEnergy').textContent=energy+'万';
  document.getElementById('vOutput').textContent=output+'万';
  var reduceWorkers=Math.round(workers*0.70);
  var laborSave=reduceWorkers*8*12;
  var defectReduce=Math.round(output*10000*(defect/100)*0.50);
  var energySave=energy*12*0.35;
  var defectValue=defectReduce*0.0008;
  var totalSave=Math.round(laborSave+defectValue+energySave);
  var invest=800*lines;
  var payback=invest/totalSave*12;
  var carbon=Math.round(output*0.003*lines);
  document.getElementById('rWorkers').textContent='↓'+reduceWorkers+'人(70%)';
  document.getElementById('rLabor').textContent='¥'+laborSave.toLocaleString()+'万';
  document.getElementById('rDefect').textContent=defectReduce.toLocaleString()+'块';
  document.getElementById('rEnergy').textContent='¥'+Math.round(energySave).toLocaleString()+'万';
  document.getElementById('rPayback').textContent=payback.toFixed(1)+' 个月';
  document.getElementById('rCarbon').textContent=carbon.toLocaleString()+' tCO2';
  document.getElementById('rTotal').textContent='综合年降本：¥'+totalSave.toLocaleString()+'万';
}

/* ===== COST ESTIMATOR ===== */
function calcCost(){
  var vol=+document.getElementById('sCostVol').value;
  var m=+document.getElementById('sCostManual').value;
  var loss=+document.getElementById('sCostLoss').value;
  document.getElementById('cVol').textContent=vol.toLocaleString();
  document.getElementById('cManual').textContent=m.toFixed(1);
  document.getElementById('cLoss').textContent=loss;
  var perManual=m+loss*0.12;
  var perAuto=m*0.12+0.05;
  var save=perManual-perAuto;
  document.getElementById('cPer').textContent='¥'+perAuto.toFixed(2);
  document.getElementById('cPerManual').textContent='¥'+perManual.toFixed(2);
  document.getElementById('cSave').textContent='¥'+save.toFixed(2);
  document.getElementById('cYear').textContent='年节省：¥'+(save*vol*300/10000).toFixed(1)+'万';
}

/* ===== KNOWLEDGE GRAPH AGENT (self-contained brain) ===== */
var KG=[
  {k:['异形砖','裂纹','异形砖a'],t:'异形砖A 裂纹分析',a:'<strong>异形砖A 表面裂纹</strong>：常见根因为<strong>成型压力不均</strong>与<strong>干燥速率过快</strong>（边角失水开裂）。推理链路：异形砖A ⇒ 可能缺陷 表面裂纹 ⇒ 原因 成型压力不均/干燥过快 ⇒ 方案 优化压机二次加压曲线、降低干燥初期风速。置信度 92%。<br>关联案例：新沂研究院异形砖A 良品率由 91% 提升至 98.2%。'},
  {k:['高铝砖','烧成','参数','温度'],t:'高铝砖 烧成参数',a:'<strong>高铝砖（Al₂O₃≥75%）</strong> 推荐烧成参数：隧道窑升温曲线 室温→1400℃ 保温 8–10h，止火温度 1430±20℃，推车周期 60min/车。<br>关联缺陷：烧成温度不足易致<strong>强度不达标</strong>，过烧致<strong>变形开裂</strong>。知识图谱已内置 6 种砖型工艺参数库。'},
  {k:['视声融合','检测原理','原理','怎么检','融合'],t:'视声融合检测原理',a:'<strong>视声融合检测</strong>：以 YOLOv8 工业相机捕获<strong>表面缺陷</strong>（裂纹/缺角/色差，精度 0.08mm），以 256 阵元超声相控阵捕获<strong>内部缺陷</strong>（气孔/分层，精度 0.8mm），MZX-Box 边缘端融合双模态判定，综合检出率 ≥98.5%，节拍 0.42s/件，误检率 &lt;0.4%。'},
  {k:['烘干','隧道','优势','干燥'],t:'烘干隧道优势',a:'<strong>红外烘干隧道</strong>：分阶段控温（先 100℃ 保温再升至 380℃），温控 ±2℃，含水率均匀脱除避免开裂。AI 自迭代以残差驱动优化升温曲线，较传统自然干燥<strong>周期缩短 40%+</strong>、能耗降低 ≥35%。'},
  {k:['投资','回报','roi','测算','收益','降本'],t:'投资回报分析',a:'<strong>投资回报</strong>：单线硬件约 207 万 + 持续 SaaS 订阅。以 40 人产线为例，用工减少 70%（↓28人）年省人工约 2,688 万，叠加不良挽回与节能，<strong>综合年降本数百万元，回收期 10–14 月</strong>。详见「改造参数估算器」输入你的产线。'},
  {k:['山西','脱皮','案例'],t:'山西脱皮案例',a:'<strong>山西鑫城科技脱皮案例</strong>：镁碳砖表面脱皮，知识图谱推理根因为<strong>结合剂分布不均 + 烧成升温过急</strong>，方案调整为梯度升温并优化结合剂混料工艺后，脱皮率由 4.1% 降至 0.6%，综合检出率 98.8%。'},
  {k:['标砖230','标砖'],t:'标砖230',a:'<strong>标砖230（230×114×65mm）</strong>：视觉检测精度 0.08mm，常见缺陷表面裂纹（长≥10mm 判不合格）。推荐烧成：1380±20℃ 保温 6h。已在新沂标杆线规模化部署。'},
  {k:['镁碳砖'],t:'镁碳砖',a:'<strong>镁碳砖（MgO≥80%）</strong>：用于钢包/转炉，内部气孔为关键缺陷（超声 0.8mm 检出）。视声融合双模态判定，避免内部缺陷流入钢厂导致事故。'},
  {k:['气孔','内部'],t:'内部气孔',a:'<strong>内部气孔</strong>：成因多为<strong>泥料含气/困料不足</strong>与<strong>烧成排气不畅</strong>。超声相控阵可检出 Ø≥0.8mm 气孔；方案为延长困料时间、优化排气道。'},
  {k:['缺角','掉块','崩边'],t:'缺角崩边',a:'<strong>缺角/崩边</strong>：成因多为<strong>成型模具磨损</strong>与<strong>出砖碰撞</strong>。视觉 0.08mm 轮廓检测可捕获；方案为模具定期更换 + 缓冲输送。'},
  {k:['澳门','出海','中葡','葡语'],t:'澳门战略',a:'<strong>澳门战略</strong>：以澳门总部为支点，借中葡商贸服务平台对接葡语国家建材市场（巴西水泥年消费 6470 万吨）。团队含澳门籍成员负责「1+4」政策与合规把关，构成独家出海通道。'},
  {k:['碳','双碳','减碳','节能'],t:'双碳减碳',a:'<strong>双碳减碳</strong>：智能工艺优化使单位能耗降低 ≥35%、碳排减少 ~58%，单线年减碳 800–1200 吨，CCER 收益 8–12 万/线·年。'},
  {k:['团队','关于','你们','谁'],t:'团队介绍',a:'<strong>团队</strong>：3 人，西安交通大学，采用「西安研发 + 澳门总部 + 大湾区交付」模式，含澳门籍成员负责政策与合规。完整介绍见团队介绍页 ↗。'}
];
function askAgent(q){
  var input=document.getElementById('agentInput');
  var question=(typeof q==='string'&&q)?q:input.value.trim();
  if(!question)return; if(typeof q!=='string'||!q)input.value='';
  var chat=document.getElementById('agentChat');
  appendMsg('user',question);
  var typing=document.createElement('div');typing.className='msg agent';
  typing.innerHTML='<div class="typing-dots"><span></span><span></span><span></span></div>';
  chat.appendChild(typing);chat.scrollTop=chat.scrollHeight;
  setTimeout(function(){
    chat.removeChild(typing);
    var low=question.toLowerCase();
    var best=null,bestScore=0;
    KG.forEach(function(e){
      var s=0;e.k.forEach(function(kw){if(low.indexOf(kw.toLowerCase())>=0)s+=kw.length;});
      if(s>bestScore){bestScore=s;best=e;}
    });
    var ans;
    if(best&&bestScore>0){
      ans=best.a+'<div class="msg-suggest"><span style="font-size:10px;color:#94a3b8;margin-right:4px">继续了解：</span>'+
        KG.filter(function(e){return e!==best;}).slice(0,3).map(function(e){return '<button class="msg-suggest-btn" onclick="askAgent(\''+e.t+'\')">'+e.t+'</button>';}).join('')+'</div>';
    }else{
      ans='<strong>知识图谱中暂未精确匹配此问题。</strong><br><br><em style="color:#94a3b8;font-size:11px">您可以试试：异形砖A裂纹分析、高铝砖烧成参数、视声融合检测原理、烘干隧道优势、投资回报分析、山西脱皮案例。</em>'+
        '<div class="msg-suggest">'+KG.slice(0,4).map(function(e){return '<button class="msg-suggest-btn" onclick="askAgent(\''+e.t+'\')">'+e.t+'</button>';}).join('')+'</div>';
    }
    appendMsg('agent',ans);
  },600+Math.random()*200);
}
function appendMsg(role,text){
  var chat=document.getElementById('agentChat');
  var div=document.createElement('div');div.className='msg '+role;
  var label=role==='user'?'你':'知识图谱引擎';
  div.innerHTML='<div class="meta">'+label+'</div>'+text.replace(/\n/g,'<br>');
  chat.appendChild(div);chat.scrollTop=chat.scrollHeight;
}
function initAgent(){
  try{appendMsg('agent','您好，我是<strong>熔智淬新工艺知识图谱引擎</strong> 🤖 可解答砖型参数、缺陷根因、检测原理与改造收益。点击下方标签或输入问题试试。');}catch(e){}
}

/* ===== VISION DEMO ===== */
var demoRunning=false;
function runVisionDemo(){
  if(demoRunning)return;demoRunning=true;
  var btn=document.getElementById('demoBtn'),status=document.getElementById('demoStatus'),
      log=document.getElementById('demoLog'),layer=document.getElementById('bricksLayer'),
      verdict=document.getElementById('verdictText'),
      markVis=document.getElementById('markVis'),markUlt=document.getElementById('markUlt'),markBox=document.getElementById('markBox');
  btn.disabled=true;btn.textContent='演示中...';
  log.innerHTML='';verdict.textContent='等待砖坯…';
  markVis.setAttribute('opacity','0');markUlt.setAttribute('opacity','0');markBox.setAttribute('opacity','0');
  var queue=[
    {name:'标砖230',color:'#d97706',defect:'表面裂纹',verdict:'不合格',bad:true,detail:'230×114×65mm · 视觉0.08mm · 裂纹12mm'},
    {name:'高铝砖',color:'#0ea5e9',defect:'内部气孔',verdict:'不合格',bad:true,detail:'Al₂O₃≥75% · 超声0.8mm · 气孔Ø3.2mm'},
    {name:'异形砖A',color:'#f59e0b',defect:'缺角崩边',verdict:'不合格',bad:true,detail:'异型·轮廓 · 视觉0.08mm · 缺角4×6mm'},
    {name:'标砖300',color:'#10b981',defect:'无',verdict:'合格',bad:false,detail:'300×150×75mm · 表面/内部无缺陷'},
    {name:'异形砖B',color:'#3b82f6',defect:'无',verdict:'合格',bad:false,detail:'异型·复杂 · 表面/内部无缺陷'},
    {name:'镁碳砖',color:'#10b981',defect:'无',verdict:'合格',bad:false,detail:'MgO≥80% · 表面/内部无缺陷'}
  ];
  var BELT_Y=214,W=36,H=32,X0=-W,current=null,judgedPass=null;
  layer.innerHTML='';
  function spawn(b){var r=document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttribute('x',X0);r.setAttribute('y',BELT_Y);r.setAttribute('width',W);r.setAttribute('height',H);
    r.setAttribute('rx','5');r.setAttribute('fill',b.color);r.setAttribute('stroke','#fde68a');r.setAttribute('stroke-width','1.5');
    b.el=r;b.x=X0;layer.appendChild(r);current=b;judgedPass=null;
    status.textContent='上料：'+b.name+' 进入产线（节拍 0.42s/件）';}
  function moveTo(cx,cb){var target=cx-18,step=22;
    var iv=setInterval(function(){var d=target-(current?current.x:X0);
      if(Math.abs(d)<=step){if(current){current.x=target;current.el.setAttribute('x',target);}clearInterval(iv);cb();return;}
      if(current){current.x+=Math.sign(d)*step;current.el.setAttribute('x',current.x);}},24);}
  function pulse(m){m.setAttribute('opacity','1');setTimeout(function(){m.setAttribute('opacity','0');},700);}
  function judge(b){if(judgedPass===b)return;judgedPass=b;var vcls=b.bad?'t-vis':'t-ok';
    verdict.textContent=b.name+' → '+b.verdict;
    logLine(log,'<b>'+b.name+'</b> 经融合判定：<span class="'+vcls+'">'+(b.bad?('发现'+b.defect+' · '+b.verdict):b.verdict)+'</span>');
    status.textContent='MZX-Box 融合判定：'+b.name+' → '+b.verdict;}
  var MOVE=1100,PAUSE=900,idx=0;
  function next(){if(idx>=queue.length){
      var ok=queue.filter(function(b){return !b.bad;}).length,ng=queue.length-ok;
      verdict.textContent='批次完成 · 合格 '+ok+' / 不合格 '+ng;
      status.textContent='检测完成：'+queue.length+' 件依次判定，综合检出率 ≥98.5%';
      var passRate=(ok/queue.length*100).toFixed(0);
      var lines=queue.map(function(b){var vcls=b.bad?'t-vis':'t-ok';
        return '<div class="sum-row"><span class="sum-name">'+b.name+'</span><span class="sum-dim">'+b.detail+'</span><span class="sum-verdict '+vcls+'">'+(b.bad?('不合格 · '+b.defect):'合格')+'</span></div>';}).join('');
      var box=document.getElementById('demoSummary');
      box.innerHTML='<div style="font-weight:700;margin-bottom:6px">批次检测汇总 · 共 '+queue.length+' 件（节拍 0.42s/件）</div>'+lines+'<div style="margin-top:6px;font-weight:700">合格率 '+passRate+'% · 综合检出率 ≥98.5% · 误检率 &lt;0.4%</div>';
      box.style.display='block';btn.disabled=false;btn.textContent='▶ 重新演示';demoRunning=false;return;}
    var b=queue[idx++];spawn(b);
    setTimeout(function(){moveTo(280,function(){pulse(markVis);status.textContent=b.name+' 经 工业相机 e4（表面视觉）';
      setTimeout(function(){moveTo(460,function(){pulse(markUlt);status.textContent=b.name+' 经 相控阵 e3（内部超声）';
        setTimeout(function(){moveTo(658,function(){pulse(markBox);status.textContent=b.name+' 进入 MZX-Box e1 融合…';
          setTimeout(function(){judge(b);setTimeout(function(){moveTo(920,function(){layer.removeChild(b.el);next();});},PAUSE);},PAUSE);});},MOVE);});},PAUSE);});},MOVE);
  }
  next();
}
function logLine(log,html){var d=document.createElement('div');d.className='log-line';d.innerHTML=html;log.appendChild(d);}

/* ===== CONTROL (温控自迭代 SVG) ===== */
function renderControlSVG(){
  var T0=25,Tset=380,tPhase1=120,tau=46,N=60,dt=5;
  var tArr=[],Tmeas=[],Tfit=[];
  for(var i=0;i<N;i++){
    var t=i*dt;
    var phase=t<=tPhase1?Tset:Tset;
    var effTau=t<=tPhase1?tau*1.4:tau;
    var base=phase+(T0-phase)*Math.exp(-t/effTau);
    var evap=(t>120&&t<260)?(20*Math.sin(Math.PI*(t-120)/140)):0;
    var pw=(t>tPhase1)?(6*Math.sin(t/4.5)+2*Math.sin(t/2.0)):0;
    var tv=base+evap+pw;
    tArr.push(t);Tmeas.push(tv);
    var fit=base+evap*0.95+pw*0.9;
    Tfit.push(fit);
  }
  function pts(arr){return arr.map(function(v,i){var x=40+(tArr[i]/295)*400;var y=220-((v-25)/(380-25))*200;return x.toFixed(1)+','+y.toFixed(1);}).join(' ');}
  document.getElementById('ctrlMeas').setAttribute('points',pts(Tmeas));
  document.getElementById('ctrlFit').setAttribute('points',pts(Tfit));
  var cards=[
    {t:'① 牛顿冷却（纯理论式）',d:'直接代入标称参数，未拟合。残差同时含结构偏差与 ±2℃ 噪声。',cls:'bad',rmse:'RMSE ≈ 14.2℃'},
    {t:'② 加分阶段平台项',d:'捕捉「先保温后升温」阶跃结构，保温→升温显著收敛。',cls:'bad',rmse:'RMSE ≈ 7.8℃'},
    {t:'③ 泰勒二阶非线性',d:'二次项吸收含水蒸发 S 形与红外辐射非线性，RMSE 大幅下降。',cls:'good',rmse:'RMSE ≈ 3.1℃'},
    {t:'④ 残差数据驱动修正',d:'AI 叠项补上红外功率高频脉动，残差逼近噪声带。',cls:'good',rmse:'RMSE ≈ 1.0℃'}
  ];
  document.getElementById('ctrlCards').innerHTML=cards.map(function(c){
    return '<div class="mcard '+c.cls+'"><h5>'+c.t+' <span class="rmse">'+c.rmse+'</span></h5><p>'+c.d+'</p></div>';
  }).join('');
}

/* ===== COMPETE RADAR (hand-drawn SVG) ===== */
function drawRadar(){
  var dims=['耐材行业定制','综合检出率','全流程交付','AI自进化SaaS','中葡出海通道','中小企性价比'];
  var data={lz:[92,98,95,90,95,93],hk:[25,72,30,40,15,70],bx:[15,40,60,30,10,35],sm:[35,60,45,20,5,80]};
  var cx=180,cy=150,R=110;
  var svg=document.getElementById('radarSvg');var ns='http://www.w3.org/2000/svg';
  function ang(i){return (-90+i*60)*Math.PI/180;}
  function pt(i,val){var r=R*val/100;return [cx+r*Math.cos(ang(i)),cy+r*Math.sin(ang(i))];}
  var html='';
  [0.25,0.5,0.75,1].forEach(function(f){
    var p=dims.map(function(_,i){var q=pt(i,f);return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');
    html+='<polygon points="'+p+'" fill="none" stroke="#e2e8f0"/>';
  });
  dims.forEach(function(d,i){var q=pt(i,1.18);
    html+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+R*Math.cos(ang(i)))+'" y2="'+(cy+R*Math.sin(ang(i)))+'" stroke="#e2e8f0"/>';
    html+='<text x="'+q[0].toFixed(1)+'" y="'+q[1].toFixed(1)+'" font-size="10" fill="#64748b" text-anchor="middle">'+d+'</text>';
  });
  var colors={lz:['#f59e0b','rgba(245,158,11,.18)'],hk:['#06b6d4','rgba(6,182,212,.10)'],bx:['#94a3b8','rgba(148,163,184,.10)'],sm:['#3b82f6','rgba(59,130,246,.10)']};
  Object.keys(data).forEach(function(k){
    var p=data[k].map(function(v,i){var q=pt(i,v);return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');
    html+='<polygon points="'+p+'" fill="'+colors[k][1]+'" stroke="'+colors[k][0]+'" stroke-width="2"/>';
  });
  html+='<g font-size="10" font-weight="700"><text x="'+(cx-R-2)+'" y="'+(cy+4)+'" fill="#f59e0b" text-anchor="end">熔智淬新</text></g>';
  svg.innerHTML=html;
}

/* ===== REALTIME JITTER ===== */
function jitter(id,base,amp){var el=document.getElementById(id);if(!el)return;
  var v=base*(1+(Math.random()*2-1)*amp/100);
  var unit=(id==='rt1a'||id==='rt2a')?' h':(base<100?('%'):'');
  el.textContent=(base>=1000?Math.round(v).toLocaleString():((Math.round(v*10)/10)+unit));}
function liveJitter(){
  jitter('rt1a',2847,0.6);jitter('rt1b',98.6,0.3);jitter('rt1c',88.5,0.4);
  jitter('rt2a',1932,0.6);jitter('rt2b',98.8,0.3);jitter('rt2c',90.1,0.4);
}
function initRealtime(){liveJitter();setInterval(liveJitter,4000);}
function initRoiCalc(){try{calcROI();}catch(e){}try{calcCost();}catch(e){}try{drawRadar();}catch(e){}}
