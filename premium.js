/* ===== CLINICIANS BLUEPRINT — PREMIUM FEATURES (v1) ===== */
/* Note-taking, Progress Tracking, Streaks, Trophies */
/* Add <script src="premium.js"></script> after themes.js in any module */

(function(){
  var PREFIX = 'cb-';
  var MOD = document.title.replace('Clinicians Blueprint','').replace(/[—\-]/g,'').trim().replace(/\s+/g,'-').toLowerCase().slice(0,40);
  if(!MOD) MOD = location.pathname.split('/').pop().replace('.html','');

  /* ===== UTILITY ===== */
  function g(k,d){try{var v=localStorage.getItem(PREFIX+k);return v?JSON.parse(v):d}catch(e){return d}}
  function s(k,v){try{localStorage.setItem(PREFIX+k,JSON.stringify(v))}catch(e){}}
  function $(sel){return document.querySelector(sel)}
  function $$(sel){return document.querySelectorAll(sel)}

  /* ===== PROGRESS TRACKING ===== */
  function trackVisit(){
    var visits = g('visits',{});
    var today = new Date().toISOString().slice(0,10);
    if(!visits[MOD]) visits[MOD] = [];
    if(visits[MOD].indexOf(today)===-1) visits[MOD].push(today);
    s('visits', visits);
    // Track daily streak
    var days = g('streakDays',[]);
    if(days.indexOf(today)===-1){days.push(today);s('streakDays',days)}
    // Track tabs opened
    var tabs = g('tabsOpened',{});
    if(!tabs[MOD]) tabs[MOD]=[];
    s('tabsOpened',tabs);
  }
  function trackTab(tabId){
    var tabs = g('tabsOpened',{});
    if(!tabs[MOD]) tabs[MOD]=[];
    if(tabs[MOD].indexOf(tabId)===-1){tabs[MOD].push(tabId);s('tabsOpened',tabs)}
    checkTrophies();
  }
  function getStreak(){
    var days = g('streakDays',[]).sort();
    if(!days.length) return 0;
    var streak=1, today=new Date().toISOString().slice(0,10);
    // Check if today or yesterday is in the list
    var last = days[days.length-1];
    var diff = Math.floor((new Date(today)-new Date(last))/(86400000));
    if(diff>1) return 0; // streak broken
    for(var i=days.length-1;i>0;i--){
      var d1=new Date(days[i]),d2=new Date(days[i-1]);
      if(Math.floor((d1-d2)/86400000)===1) streak++;
      else break;
    }
    return streak;
  }
  function getStats(){
    var visits=g('visits',{}), tabs=g('tabsOpened',{}), trophies=g('trophies',[]);
    var totalMods=Object.keys(visits).length;
    var totalTabs=0; for(var k in tabs) totalTabs+=tabs[k].length;
    var totalVisits=0; for(var k in visits) totalVisits+=visits[k].length;
    return {mods:totalMods,tabs:totalTabs,visits:totalVisits,streak:getStreak(),trophies:trophies.length};
  }

  /* ===== TROPHIES ===== */
  var TROPHY_DEFS = [
    {id:'first_visit',name:'First Steps',icon:'🏥',desc:'Visited your first module',check:function(s){return s.mods>=1}},
    {id:'explorer_5',name:'Explorer',icon:'🧭',desc:'Visited 5 different modules',check:function(s){return s.mods>=5}},
    {id:'scholar_10',name:'Scholar',icon:'📚',desc:'Visited 10 different modules',check:function(s){return s.mods>=10}},
    {id:'master_20',name:'Master Clinician',icon:'🎓',desc:'Visited 20 different modules',check:function(s){return s.mods>=20}},
    {id:'deep_dive',name:'Deep Dive',icon:'🔬',desc:'Opened 10 different tabs',check:function(s){return s.tabs>=10}},
    {id:'tab_warrior',name:'Tab Warrior',icon:'⚔️',desc:'Opened 50 different tabs',check:function(s){return s.tabs>=50}},
    {id:'streak_3',name:'On a Roll',icon:'🔥',desc:'3-day study streak',check:function(s){return s.streak>=3}},
    {id:'streak_7',name:'Week Warrior',icon:'💪',desc:'7-day study streak',check:function(s){return s.streak>=7}},
    {id:'streak_14',name:'Unstoppable',icon:'⭐',desc:'14-day study streak',check:function(s){return s.streak>=14}},
    {id:'streak_30',name:'Legend',icon:'👑',desc:'30-day study streak',check:function(s){return s.streak>=30}},
    {id:'note_taker',name:'Note Taker',icon:'✏️',desc:'Saved your first note',check:function(s){return Object.keys(g('notes',{})).length>=1}},
    {id:'dedicated',name:'Dedicated',icon:'💎',desc:'25 total study sessions',check:function(s){return s.visits>=25}},
  ];
  function checkTrophies(){
    var stats=getStats(), earned=g('trophies',[]), newTrophy=null;
    TROPHY_DEFS.forEach(function(t){
      if(earned.indexOf(t.id)===-1 && t.check(stats)){
        earned.push(t.id);
        newTrophy=t;
      }
    });
    s('trophies',earned);
    if(newTrophy) showTrophyToast(newTrophy);
    updatePanel();
  }
  function showTrophyToast(t){
    var toast=document.createElement('div');
    toast.className='cb-trophy-toast';
    toast.innerHTML='<span class="cb-tt-icon">'+t.icon+'</span><div><strong>Trophy Unlocked!</strong><br>'+t.name+' — '+t.desc+'</div>';
    document.body.appendChild(toast);
    setTimeout(function(){toast.classList.add('show')},50);
    setTimeout(function(){toast.classList.remove('show');setTimeout(function(){toast.remove()},400)},3500);
  }

  /* ===== NOTES ===== */
  function getNotes(){return g('notes',{})}
  function saveNote(key,text){var n=getNotes();if(text.trim())n[key]=text;else delete n[key];s('notes',n);checkTrophies()}
  function getNoteKey(){return MOD+'-'+(document.querySelector('.tab-panel.active')?document.querySelector('.tab-panel.active').id:'general')}

  /* ===== UI INJECTION ===== */
  function injectCSS(){
    var style=document.createElement('style');
    style.textContent='\
.cb-fab{position:fixed;bottom:20px;right:20px;z-index:150;display:flex;flex-direction:column;gap:8px;align-items:flex-end}\
.cb-fab-btn{width:44px;height:44px;border-radius:12px;border:1px solid var(--border);background:var(--bg2);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.1);transition:all .25s ease;backdrop-filter:blur(10px)}\
.cb-fab-btn:hover{transform:scale(1.1);box-shadow:0 6px 24px rgba(0,0,0,.15)}\
.cb-fab-btn.active{background:var(--accent);color:#fff}\
.cb-panel{position:fixed;bottom:76px;right:20px;z-index:149;width:340px;max-height:70vh;background:var(--bg2);border:1px solid var(--border);border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.12);overflow:hidden;display:none;flex-direction:column;transition:all .3s ease}\
.cb-panel.open{display:flex;animation:cbSlideUp .3s ease}\
@keyframes cbSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\
.cb-panel-header{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}\
.cb-panel-header h3{font-family:"Source Serif 4",serif;font-size:15px;font-weight:600;color:var(--text)}\
.cb-panel-close{background:none;border:none;color:var(--text3);cursor:pointer;font-size:16px;padding:2px 6px;border-radius:4px}\
.cb-panel-close:hover{background:var(--bg3)}\
.cb-panel-body{padding:14px 16px;overflow-y:auto;flex:1}\
.cb-note-area{width:100%;min-height:120px;border:1px solid var(--border);border-radius:8px;padding:10px;font-family:"Manrope",sans-serif;font-size:13px;background:var(--bg);color:var(--text);resize:vertical;outline:none;transition:border-color .2s}\
.cb-note-area:focus{border-color:var(--accent)}\
.cb-note-hint{font-size:11px;color:var(--text3);margin-top:6px;font-family:"IBM Plex Mono",monospace}\
.cb-note-saved{color:var(--accent);font-weight:600}\
.cb-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}\
.cb-stat{background:var(--bg3);border-radius:8px;padding:10px;text-align:center}\
.cb-stat-num{font-family:"Source Serif 4",serif;font-size:22px;font-weight:700;color:var(--accent);line-height:1}\
.cb-stat-label{font-size:10px;color:var(--text3);font-family:"IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.8px;margin-top:3px}\
.cb-trophy-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px}\
.cb-trophy{text-align:center;padding:8px 4px;border-radius:8px;background:var(--bg3);transition:all .2s}\
.cb-trophy.earned{background:var(--soft);border:1px solid var(--mid)}\
.cb-trophy.locked{opacity:.3;filter:grayscale(1)}\
.cb-trophy-icon{font-size:20px;display:block}\
.cb-trophy-name{font-size:8px;color:var(--text2);margin-top:2px;font-family:"IBM Plex Mono",monospace;line-height:1.2}\
.cb-trophy-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);z-index:200;background:var(--bg2);border:1px solid var(--accent);border-radius:12px;padding:12px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,.15);opacity:0;transition:all .4s ease;pointer-events:none}\
.cb-trophy-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}\
.cb-tt-icon{font-size:28px}\
.cb-trophy-toast strong{color:var(--accent);font-size:13px}\
.cb-trophy-toast div{font-size:12px;color:var(--text2)}\
.cb-tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:10px}\
.cb-tab-btn{flex:1;padding:8px;text-align:center;font-size:11px;font-family:"IBM Plex Mono",monospace;font-weight:600;color:var(--text3);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;transition:all .2s}\
.cb-tab-btn:hover{color:var(--text)}\
.cb-tab-btn.active{color:var(--accent);border-bottom-color:var(--accent)}\
.cb-tab-content{display:none}\
.cb-tab-content.active{display:block}\
.cb-progress-bar{height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:8px}\
.cb-progress-fill{height:100%;background:var(--accent);border-radius:2px;transition:width .5s ease}\
.cb-reset-btn{margin-top:12px;font-size:11px;color:var(--text3);background:none;border:1px solid var(--border);padding:4px 10px;border-radius:6px;cursor:pointer;font-family:"IBM Plex Mono",monospace}\
.cb-reset-btn:hover{border-color:var(--red);color:var(--red)}\
@media(max-width:500px){.cb-panel{width:calc(100vw - 24px);right:12px;bottom:70px}.cb-fab{bottom:12px;right:12px}}\
    ';
    document.head.appendChild(style);
  }

  function injectUI(){
    // FAB buttons
    var fab=document.createElement('div');
    fab.className='cb-fab';
    fab.innerHTML='\
<div class="cb-fab-btn" onclick="CB_PREMIUM.togglePanel()" title="Study Tools">📋</div>\
    ';
    document.body.appendChild(fab);

    // Panel
    var panel=document.createElement('div');
    panel.className='cb-panel';
    panel.id='cb-premium-panel';
    panel.innerHTML='\
<div class="cb-panel-header"><h3>Study Tools</h3><button class="cb-panel-close" onclick="CB_PREMIUM.togglePanel()">&#10005;</button></div>\
<div class="cb-panel-body">\
  <div class="cb-tabs">\
    <button class="cb-tab-btn active" onclick="CB_PREMIUM.showPTab(\'notes\',this)">Notes</button>\
    <button class="cb-tab-btn" onclick="CB_PREMIUM.showPTab(\'progress\',this)">Progress</button>\
    <button class="cb-tab-btn" onclick="CB_PREMIUM.showPTab(\'trophies\',this)">Trophies</button>\
  </div>\
  <div class="cb-tab-content active" id="cb-ptab-notes">\
    <textarea class="cb-note-area" id="cb-note-input" placeholder="Type your notes for this tab..."></textarea>\
    <div class="cb-note-hint" id="cb-note-status">Auto-saves as you type</div>\
  </div>\
  <div class="cb-tab-content" id="cb-ptab-progress">\
    <div class="cb-stat-grid" id="cb-stats"></div>\
    <div class="cb-progress-bar" style="margin-top:12px"><div class="cb-progress-fill" id="cb-prog-fill"></div></div>\
    <div class="cb-note-hint" style="margin-top:4px" id="cb-prog-label"></div>\
    <button class="cb-reset-btn" onclick="CB_PREMIUM.resetProgress()">Reset All Progress</button>\
  </div>\
  <div class="cb-tab-content" id="cb-ptab-trophies">\
    <div class="cb-trophy-grid" id="cb-trophy-list"></div>\
  </div>\
</div>\
    ';
    document.body.appendChild(panel);
  }

  var noteTimer=null;
  function setupNotes(){
    var input=document.getElementById('cb-note-input');
    if(!input) return;
    // Load existing note
    var key=getNoteKey();
    var notes=getNotes();
    if(notes[key]) input.value=notes[key];
    // Auto-save on input
    input.addEventListener('input',function(){
      clearTimeout(noteTimer);
      noteTimer=setTimeout(function(){
        saveNote(getNoteKey(),input.value);
        var st=document.getElementById('cb-note-status');
        if(st){st.textContent='Saved ✓';st.className='cb-note-hint cb-note-saved';
          setTimeout(function(){st.textContent='Auto-saves as you type';st.className='cb-note-hint'},1500)}
      },600);
    });
  }

  function updatePanel(){
    var stats=getStats();
    var sg=document.getElementById('cb-stats');
    if(sg) sg.innerHTML='\
<div class="cb-stat"><div class="cb-stat-num">'+stats.streak+'</div><div class="cb-stat-label">Day Streak</div></div>\
<div class="cb-stat"><div class="cb-stat-num">'+stats.mods+'</div><div class="cb-stat-label">Modules</div></div>\
<div class="cb-stat"><div class="cb-stat-num">'+stats.tabs+'</div><div class="cb-stat-label">Tabs Opened</div></div>\
<div class="cb-stat"><div class="cb-stat-num">'+stats.trophies+'</div><div class="cb-stat-label">Trophies</div></div>\
    ';
    // Progress bar (% of 40 modules as goal)
    var pct=Math.min(100,Math.round(stats.mods/40*100));
    var fill=document.getElementById('cb-prog-fill');
    var label=document.getElementById('cb-prog-label');
    if(fill) fill.style.width=pct+'%';
    if(label) label.textContent=stats.mods+' of 40 modules visited ('+pct+'%)';
    // Trophies
    var tl=document.getElementById('cb-trophy-list');
    if(tl){
      var earned=g('trophies',[]);
      tl.innerHTML=TROPHY_DEFS.map(function(t){
        var e=earned.indexOf(t.id)!==-1;
        return '<div class="cb-trophy '+(e?'earned':'locked')+'" title="'+(e?t.name+': '+t.desc:'???')+'">\
          <span class="cb-trophy-icon">'+(e?t.icon:'🔒')+'</span>\
          <div class="cb-trophy-name">'+(e?t.name:'???')+'</div></div>';
      }).join('');
    }
  }

  function loadNoteForCurrentTab(){
    var input=document.getElementById('cb-note-input');
    if(!input) return;
    var key=getNoteKey();
    var notes=getNotes();
    input.value=notes[key]||'';
    var st=document.getElementById('cb-note-status');
    if(st){st.textContent='Auto-saves as you type';st.className='cb-note-hint'}
  }

  /* ===== PUBLIC API ===== */
  window.CB_PREMIUM = {
    togglePanel: function(){
      var p=document.getElementById('cb-premium-panel');
      if(p){p.classList.toggle('open');if(p.classList.contains('open')){updatePanel();loadNoteForCurrentTab()}}
    },
    showPTab: function(id,btn){
      $$('.cb-tab-content').forEach(function(el){el.classList.remove('active')});
      $$('.cb-tab-btn').forEach(function(el){el.classList.remove('active')});
      var t=document.getElementById('cb-ptab-'+id);
      if(t) t.classList.add('active');
      if(btn) btn.classList.add('active');
      if(id==='notes') loadNoteForCurrentTab();
      if(id==='progress'||id==='trophies') updatePanel();
    },
    resetProgress: function(){
      if(confirm('Reset ALL progress, notes, streaks, and trophies? This cannot be undone.')){
        ['visits','streakDays','tabsOpened','trophies','notes'].forEach(function(k){localStorage.removeItem(PREFIX+k)});
        updatePanel();
      }
    }
  };

  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded',function(){
    injectCSS();
    injectUI();
    setupNotes();
    trackVisit();

    // Hook into tab switching to track tabs and update notes
    var origShowTab=window.showTab;
    if(typeof origShowTab==='function'){
      window.showTab=function(id,btn){
        origShowTab(id,btn);
        trackTab(id);
        setTimeout(loadNoteForCurrentTab,50);
      };
    }
    // Also track initial active tab
    var activeTab=$('.tab-panel.active');
    if(activeTab) trackTab(activeTab.id.replace('tab-',''));

    checkTrophies();
  });
})();
