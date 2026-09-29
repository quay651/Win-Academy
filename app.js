/* WIN Tax & Bookkeeping Academy — course-player preview. Data lives in data.js */

let tier = 'beginner';
let current = 0;
const completed = { beginner: new Set(), advanced: new Set() };
const quizState = { beginner: {}, advanced: {} };

function courseFor(t){ return DATA[t]; }
function flatFor(t){
  const flat = [];
  courseFor(t).forEach(g => g.lessons.forEach(l => flat.push({...l, group:g.group})));
  return flat;
}

function iconFor(){
  return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
}

function switchTier(t){
  if(t===tier) return;
  tier = t;
  current = 0;
  render();
}

function renderTierSwitch(){
  const el = document.getElementById('tierSwitch');
  el.innerHTML =
    '<button class="tier-btn'+(tier==='beginner'?' active':'')+'" onclick="switchTier(\'beginner\')">Beginner</button>'+
    '<button class="tier-btn'+(tier==='advanced'?' active':'')+'" onclick="switchTier(\'advanced\')">Advanced</button>';
}

function renderSidebar(){
  renderTierSwitch();
  const flat = flatFor(tier);
  const map = document.getElementById('courseMap');
  map.innerHTML = '';
  courseFor(tier).forEach(g=>{
    const head = document.createElement('div');
    head.className = 'mod-head';
    head.textContent = g.group;
    map.appendChild(head);
    const wrap = document.createElement('div');
    wrap.className='mod-group';
    g.lessons.forEach(l=>{
      const idx = flat.findIndex(f=>f.id===l.id);
      const btn = document.createElement('button');
      btn.className = 'lesson-btn' + (idx===current?' active':'') + (completed[tier].has(l.id)?' done':'');
      btn.onclick = ()=>{ current = idx; render(); closeNav(); };
      btn.innerHTML = '<span class="dot">'+(completed[tier].has(l.id)?'✓':'')+'</span><span class="ltitle">'+l.title+'<div class="ltag">'+l.tag+'</div></span>';
      wrap.appendChild(btn);
    });
    map.appendChild(wrap);
  });
  const total = flat.filter(f=>f.tag!=='Complete').length;
  const pct = total ? Math.round((completed[tier].size / total) * 100) : 0;
  document.getElementById('progressPct').textContent = Math.min(pct,100)+'%';
  document.getElementById('progressFill').style.width = Math.min(pct,100)+'%';
}

function renderSlide(s){
  if(!s) return '';
  return '<div class="slide">'+
    (s.eyebrow?'<div class="s-eyebrow">'+s.eyebrow+'</div>':'')+
    '<div class="s-title">'+s.title+'</div>'+
    (s.sub?'<div class="s-sub">'+s.sub+'</div>':'')+
    (s.tag?'<div class="s-tag">'+s.tag+'</div>':'')+
  '</div>';
}

function renderQuiz(lesson){
  const st = quizState[tier][lesson.id] || (quizState[tier][lesson.id] = {picked:new Array(lesson.quiz.questions.length).fill(null), checked:false});
  let correctCount = 0;
  const qs = lesson.quiz.questions.map((q,qi)=>{
    const picked = st.picked[qi];
    if(st.checked && picked===q.answer) correctCount++;
    const opts = q.opts.map((o,oi)=>{
      let cls='q-opt';
      if(picked===oi) cls+=' picked';
      if(st.checked){
        if(oi===q.answer) cls+=' correct';
        else if(oi===picked) cls+=' incorrect';
      }
      return '<label class="'+cls+'"><input type="radio" name="q'+lesson.id+'_'+qi+'" '+(picked===oi?'checked':'')+' onchange="pickAnswer(\''+lesson.id+'\','+qi+','+oi+')">'+o+'</label>';
    }).join('');
    let fb = '';
    if(st.checked){
      fb = picked===q.answer
        ? '<div class="q-feedback good">Correct — '+q.opts[q.answer]+'.</div>'
        : '<div class="q-feedback bad">Not quite. The builder answer key says: '+q.opts[q.answer]+'.</div>';
    }
    return '<div class="q-block"><div class="q-text">'+(qi+1)+'. '+q.q+'</div><div class="q-opts">'+opts+'</div>'+fb+'</div>';
  }).join('');

  const allPicked = st.picked.every(p=>p!==null);
  return '<div class="card"><div class="card-head">'+iconFor()+' '+lesson.quiz.label+'</div><div class="card-body">'+
    qs+
    '<div class="quiz-actions">'+
      '<button class="btn" '+(allPicked?'':'disabled')+' onclick="checkQuiz(\''+lesson.id+'\')">Check answers</button>'+
      (st.checked?'<span class="quiz-score">Score: <b>'+correctCount+' / '+lesson.quiz.questions.length+'</b></span>':'<span class="quiz-score">Answer every question, then check.</span>')+
    '</div>'+
  '</div>';
}

function pickAnswer(id, qi, oi){
  quizState[tier][id].picked[qi]=oi;
  quizState[tier][id].checked=false;
  render(false);
}
function checkQuiz(id){
  quizState[tier][id].checked=true;
  render(false);
}

function render(scrollTop){
  const flat = flatFor(tier);
  const lesson = flat[current];
  renderSidebar();
  document.getElementById('crumb').innerHTML = '<b>'+lesson.group+'</b> · '+lesson.title;
  document.getElementById('demoPill').textContent = tier==='beginner' ? 'Beginner tier preview' : 'Advanced tier preview';

  const pane = document.getElementById('lessonPane');
  let html = '<div class="eyebrow">'+lesson.eyebrow+'</div><h1 class="lesson-h1">'+lesson.title+'</h1>';

  html += '<div class="flow">'+lesson.flow.map((f,i)=>(i>0?'<span class="sep">→</span>':'')+'<b>'+f+'</b>').join('')+'</div>';

  if(lesson.tag === 'Complete'){
    html += '<div class="placeholder-box"><div class="display">'+lesson.slide.sub+'</div><p>'+lesson.script[0]+'</p></div>';
    pane.innerHTML = html;
    document.getElementById('nextBtn').textContent = 'Course complete';
    document.getElementById('nextBtn').disabled = true;
    if(scrollTop!==false) window.scrollTo({top:0});
    return;
  }

  // video card
  html += '<div class="card"><div class="card-head">'+iconFor()+' Video</div><div class="card-body">'+
    '<div class="video-frame"><div class="play-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 5l12 7-12 7V5z" fill="currentColor"/></svg></div>'+
    '<div class="video-caption"><b>'+lesson.title+'</b> — instructor teaching video plays here</div></div>'+
    renderSlide(lesson.slide)+
    '<button class="transcript-toggle" onclick="toggleTranscript(this)">Show video script ▾</button>'+
    '<div class="transcript" hidden>'+lesson.script.map(p=>'<p>'+p+'</p>').join('')+'</div>'+
  '</div></div>';

  // mock document image
  if(lesson.image){
    html += '<div class="card"><div class="card-head">'+iconFor()+' Source document</div><div class="card-body">'+
      '<div class="doc-image"><img src="'+lesson.image.src+'" alt="'+lesson.image.alt+'"></div></div></div>';
  }

  // generic data table
  if(lesson.table){
    html += '<div class="card"><div class="card-head">'+iconFor()+' '+lesson.table.title+'</div><div class="card-body">'+
      '<table class="data-table"><thead><tr>'+lesson.table.headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+
      lesson.table.rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+
      '</tbody></table></div></div>';
  }

  // attachments
  if(lesson.attachments && lesson.attachments.length){
    html += '<div class="card"><div class="card-head">'+iconFor()+' Attached materials</div><div class="card-body"><div class="attach-list">'+
      lesson.attachments.map(a=>'<div class="attach-chip"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 12l6-6a3 3 0 114 4l-8 8a5 5 0 11-7-7l7-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="fname">'+a+'</span><span class="ftag">Attached in build</span></div>').join('')+
      '</div></div></div>';
  }

  // student does
  if(lesson.studentDoes){
    html += '<div class="card"><div class="card-head">'+iconFor()+' Student does</div><div class="card-body"><div class="student-does"><ol>'+
      lesson.studentDoes.map(s=>'<li>'+s+'</li>').join('')+
      '</ol>'+(lesson.note?'<div class="note-pill">'+lesson.note+'</div>':'')+'</div></div></div>';
  }

  // quiz
  if(lesson.quiz){
    html += renderQuiz(lesson);
  }

  pane.innerHTML = html;
  document.getElementById('nextBtn').textContent = current < flat.length-1 ? 'Mark complete & next →' : 'Course complete';
  document.getElementById('nextBtn').disabled = false;
  if(scrollTop!==false) window.scrollTo({top:0});
}

function toggleTranscript(btn){
  const t = btn.nextElementSibling;
  const show = t.hidden;
  t.hidden = !show;
  btn.textContent = show ? 'Hide video script ▴' : 'Show video script ▾';
}

function goNext(){
  const flat = flatFor(tier);
  const lesson = flat[current];
  completed[tier].add(lesson.id);
  if(current < flat.length-1){ current++; render(); }
  else { renderSidebar(); }
}

function openNav(){ document.body.classList.add('nav-open'); }
function closeNav(){ document.body.classList.remove('nav-open'); }

render();
