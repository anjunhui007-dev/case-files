const app = document.querySelector('#app');

const CASE = {
  id: 'CASE-001',
  title: '마지막 우편함',
  genre: '의문사 / 폐쇄형 생활 공간',
  difficulty: '★★★☆☆',
  expected: '35–55분',
  location: '세림빌딩 / 지하 설비구역',
  victim: '윤태호 / 39세 / 건물 관리인',
  assignmentOverview: `비가 내리던 밤 10시 5분, 세림빌딩 관리인 윤태호가 지하 설비구역에서 숨진 채 발견되었습니다. 처음에는 설비 점검 중 발생한 사고로 보였지만, 사망 전 약 20분간 일부 CCTV가 끊겼고 1층 공용 우편함 구역에서 비정상적인 흔적이 확인되었습니다. 윤태호는 그날 저녁 누군가에게 “오늘 안에 반드시 보내야 한다”는 말을 남겼습니다. 당신은 경찰의 외부 수사 협력자로 사건을 넘겨받았습니다. 인물들의 진술, 현장 기록, CCTV, 감식 결과를 서로 대조해 마지막 40분 동안 무슨 일이 있었는지 재구성하십시오.`,
  totalEvidence: 14,
  people: {
    'person-a': {name:'한소영', role:'입주자대표회 회계 담당 / 참고인'},
    'person-b': {name:'이준석', role:'택배 기사 / 마지막 목격자 후보'},
    'person-c': {name:'차민규', role:'전기 설비 기사 / 당일 출입 기록 있음'},
    'police': {name:'이정훈 형사', role:'담당 형사 / 공식 브리핑'},
    'analyst': {name:'서지아 조사관', role:'디지털·현장 감식 담당'}
  }
};

// 정답 데이터는 UI에 출력하지 않는다. 최종 추리 채점에만 사용된다.
// 소스 열람 시 우발적 스포일러를 줄이기 위해 문자열을 분리해 둔다.
const sealed = (() => {
  const a = ['차','민','규'].join('');
  return {
    culprit: a,
    requiredConcepts: [
      ['허위','수리','청구'],
      ['적립금','공사비','비용'],
      ['우편','봉투','자료'],
      ['cctv','정전','차단'],
      ['21:43','21시 43','설비 패널','기술자 핀'],
      ['사고','위장','사다리'],
    ],
    evidenceThreshold: 8,
    contradictionThreshold: 2
  };
})();

const defaultState = () => ({
  evidence: ['E-01','E-02'],
  contradictions: [],
  notes: '',
  finalText: '',
  feed: '사건 파일이 열렸습니다.',
  visited: [],
  solved: false,
  grade: null,
  chats: {
    'person-a': [{who:'npc', text:'한소영: 경찰에 이미 말씀드린 내용은 있습니다. 그래도 필요하면 다시 답하겠습니다.'}],
    'person-b': [{who:'npc', text:'이준석: 저는 택배만 놓고 나왔어요. 그 뒤 일은 정말 모릅니다.'}],
    'person-c': [{who:'npc', text:'차민규: 저녁 점검은 일찍 끝났습니다. 사고가 난 시간에는 건물에 없었어요.'}],
    'police': [{who:'npc', text:'이정훈 형사: 현 단계에서는 사고 가능성을 배제하지 않고 있습니다. 다만 CCTV 공백이 걸립니다.'}],
    'analyst': [{who:'npc', text:'서지아 조사관: 확보된 물증과 기록만 기준으로 말씀드리겠습니다. 추정은 따로 표시하죠.'}]
  }
});

let state = JSON.parse(localStorage.getItem('casefiles-v002') || 'null') || defaultState();

function save(){ localStorage.setItem('casefiles-v002', JSON.stringify(state)); }
function mountTemplate(id){ const t=document.querySelector(id); app.replaceChildren(t.content.cloneNode(true)); }
function markVisited(scene){ if(!state.visited.includes(scene)) state.visited.push(scene); save(); }

function showHome(){
  mountTemplate('#home-template');
  const card = document.querySelector('.dashboard-card[data-action="open-case"] small');
  if(card) card.textContent = `의문사 / ${state.solved ? `해결 · ${state.grade}` : state.visited.length ? '수사 진행 중' : '미수사'}`;
}

function showBriefing(){
  app.innerHTML = `<section class="screen"><article class="scene-card case-brief">
    <div class="case-brief-visual"></div>
    <div class="case-brief-copy">
      <div class="eyebrow">${CASE.id} / ASSIGNMENT BRIEF</div>
      <h2 style="font-size:2rem;margin:.45rem 0 1rem">${CASE.title}</h2>
      <div class="case-meta">
        <div class="meta-cell"><small>사건 유형</small>${CASE.genre}</div>
        <div class="meta-cell"><small>난이도</small>${CASE.difficulty}</div>
        <div class="meta-cell"><small>예상 플레이</small>${CASE.expected}</div>
        <div class="meta-cell"><small>사건 장소</small>${CASE.location}</div>
        <div class="meta-cell"><small>피해자</small>${CASE.victim}</div>
        <div class="meta-cell"><small>상태</small>${state.solved ? 'CLOSED' : 'OPEN'}</div>
      </div>
      <div class="eyebrow" style="margin-bottom:8px">사건을 맡게 된 개요</div>
      <div class="assignment-box">${CASE.assignmentOverview}</div>
      <div style="display:flex;gap:10px;margin-top:20px">
        <button class="btn btn-primary" data-action="start-case">${state.visited.length ? '수사 계속하기' : '수사 시작'}</button>
        <button class="btn btn-ghost" data-action="home">사건 목록</button>
      </div>
    </div>
  </article></section>`;
}

function showCase(){
  mountTemplate('#case-template');
  document.querySelectorAll('.nav-item[data-scene]').forEach(btn=>btn.addEventListener('click',()=>renderScene(btn.dataset.scene)));
  renderScene('hub'); refreshStatus();
}

function setActiveScene(scene){ document.querySelectorAll('.nav-item[data-scene]').forEach(btn=>btn.classList.toggle('active',btn.dataset.scene===scene)); }
function refreshStatus(){
  const e=document.querySelector('#metric-evidence'), c=document.querySelector('#metric-contradictions'), p=document.querySelector('#progress-bar'), f=document.querySelector('#recent-feed');
  if(e) e.textContent=`${String(state.evidence.length).padStart(2,'0')} / ${CASE.totalEvidence}`;
  if(c) c.textContent=`${String(state.contradictions.length).padStart(2,'0')} / ??`;
  if(p) p.style.width=`${Math.min(96, 8 + state.evidence.length*5 + state.contradictions.length*9 + state.visited.length*2)}%`;
  if(f) f.textContent=state.feed;
}
function panel(title, eyebrow, body){ return `<article class="scene-card"><header class="scene-header"><div><div class="eyebrow">${eyebrow}</div><h3>${title}</h3></div></header><div class="scene-body">${body}</div></article>`; }

function renderScene(scene){
  markVisited(scene); setActiveScene(scene); const target=document.querySelector('#scene-content'); if(!target) return;
  const scenes={
    hub:()=>panel('수사 본부','INVESTIGATION HUB',`
      <div class="case-intro-banner"><strong>${CASE.title}</strong>${CASE.assignmentOverview}</div>
      <div class="hero-scene"><div class="hero-scene-copy"><div class="eyebrow">CURRENT NOTICE</div><h2>마지막 40분을 재구성하십시오.</h2><p>누가 무엇을 알고 있었는지보다, 각 기록이 어떤 시각에 서로 충돌하는지를 먼저 확인하는 편이 좋습니다.</p></div></div>
      <div class="action-grid">
        <button class="action-card" data-jump="person-a"><strong>한소영과 대화</strong><span>입주자대표회 관련 진술</span></button>
        <button class="action-card" data-jump="scene"><strong>사건 현장</strong><span>지하 설비구역 조사</span></button>
        <button class="action-card" data-jump="police"><strong>경찰 수사 현황</strong><span>공식 수사 정보 확인</span></button>
        <button class="action-card" data-jump="cctv"><strong>CCTV 기록</strong><span>공백 전후 프레임 검토</span></button>
      </div>`),
    scene:()=>panel('지하 설비구역','CRIME SCENE',`
      <div class="hero-scene"><div class="hero-scene-copy"><h2>현장 01 / 설비실 앞</h2><p>사고 현장으로 분류되었던 공간입니다. 사다리, 전기 패널, 바닥 흔적을 각각 따로 확인할 수 있습니다.</p></div></div>
      <div class="action-grid">
        <button class="action-card inspect" data-evidence="E-03"><strong>넘어진 사다리</strong><span>바닥과 접촉면 확인</span></button>
        <button class="action-card inspect" data-evidence="E-04"><strong>전기 패널</strong><span>최근 조작 기록 확인</span></button>
        <button class="action-card inspect contradiction" data-contradiction="CT-01"><strong>바닥의 젖은 흔적</strong><span>실내 동선과 맞지 않는 물자국</span></button>
        <button class="action-card inspect" data-evidence="E-05"><strong>피해자 작업복</strong><span>주머니 속 메모 조각</span></button>
      </div>`),
    cctv:()=>panel('세림빌딩 CCTV','CAMERA ARCHIVE',`
      <div class="hero-scene" style="filter:grayscale(1) contrast(1.15)"><div class="hero-scene-copy"><div class="eyebrow">21:40–22:00</div><h2>CAM 01 / LOBBY</h2><p>21:41 이후 일부 카메라 기록이 연속적으로 비어 있습니다. 전후 프레임과 시스템 로그를 분리해서 확인하십시오.</p></div></div>
      <div class="action-grid">
        <button class="action-card inspect" data-evidence="E-06"><strong>21:39 로비 프레임</strong><span>우편함 앞 인물의 일부가 포착됨</span></button>
        <button class="action-card inspect" data-evidence="E-07"><strong>CCTV 장애 로그</strong><span>장애 시작·복구 시각 확인</span></button>
        <button class="action-card contradiction" data-contradiction="CT-02"><strong>진술 시간과 비교</strong><span>건물 이탈 진술과 기록 대조</span></button>
        <button class="action-card inspect" data-evidence="E-08"><strong>외부 주차장 프레임</strong><span>복구 직후 이동 차량 확인</span></button>
      </div>`),
    evidence:()=>panel('증거 보관함','EVIDENCE',`<div class="evidence-grid">${evidenceCards()}</div>`),
    notes:()=>panel('추리 노트','DEDUCTION NOTES',`<textarea id="notes" class="note-area" placeholder="시간대, 진술의 모순, 확인할 사항을 기록하십시오.">${escapeHtml(state.notes)}</textarea>`),
    final:()=>finalScene()
  };
  if(['person-a','person-b','person-c','police','analyst'].includes(scene)){ target.innerHTML=dialogueScene(scene); wireDialogue(scene); }
  else target.innerHTML=(scenes[scene]||scenes.hub)();

  target.querySelectorAll('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>renderScene(btn.dataset.jump)));
  target.querySelectorAll('.inspect[data-evidence]').forEach(btn=>btn.addEventListener('click',()=>collectEvidence(btn.dataset.evidence)));
  target.querySelectorAll('[data-contradiction]').forEach(btn=>btn.addEventListener('click',()=>collectContradiction(btn.dataset.contradiction)));
  const notes=document.querySelector('#notes'); if(notes) notes.addEventListener('input',e=>{state.notes=e.target.value;save();});
  const finalText=document.querySelector('#final-text'); if(finalText) finalText.addEventListener('input',e=>{state.finalText=e.target.value;save();});
  const submit=document.querySelector('#final-submit'); if(submit) submit.addEventListener('click',submitFinal);
  refreshStatus();
}

function evidenceCards(){
  const all={
    'E-01':'피해자 휴대전화','E-02':'현관 출입기록','E-03':'넘어진 사다리 감식','E-04':'전기 패널 조작 로그','E-05':'작업복 속 메모 조각','E-06':'21:39 로비 CCTV','E-07':'CCTV 장애 로그','E-08':'외부 주차장 프레임','E-09':'공용 우편함 잠금 흔적','E-10':'찢어진 봉투 조각','E-11':'수리비 정산표','E-12':'설비 기사 작업기록','E-13':'피해자 통화 메모','E-14':'우편물 회수 기록'};
  return Object.entries(all).map(([id,name])=>{const locked=!state.evidence.includes(id);return `<div class="evidence-card" style="opacity:${locked?.34:1}"><strong>${locked?'미확보 자료':`${id} ${name}`}</strong><small>${locked?'LOCKED':'확보 완료'}</small></div>`}).join('');
}

function dialogueScene(scene){
  const meta=CASE.people[scene]; const messages=state.chats[scene].map(m=>`<div class="message ${m.who==='player'?'player':''}">${escapeHtml(m.text)}</div>`).join('');
  return `<article class="scene-card dialogue-layout"><aside class="portrait-panel"><div class="portrait"><div><div class="eyebrow">INTERVIEW SUBJECT</div><strong>${meta.name}</strong><p class="subtle">${meta.role}</p></div></div></aside><section class="chat-panel"><header class="scene-header"><div><div class="eyebrow">INTERVIEW LOG</div><h3>${meta.name}</h3></div></header><div class="chat-log">${messages}</div><div class="chat-controls"><button class="btn btn-ghost" id="show-evidence">증거 확인</button><input id="chat-input" placeholder="질문 입력…"><button id="send-chat" class="btn btn-primary">전송</button></div></section></article>`;
}

function wireDialogue(scene){
  const input=document.querySelector('#chat-input'), send=document.querySelector('#send-chat');
  const submit=()=>{const text=input.value.trim();if(!text)return;state.chats[scene].push({who:'player',text});const reply=mockReply(scene,text);state.chats[scene].push({who:'npc',text:reply});state.feed=`${CASE.people[scene].name}의 진술이 기록되었습니다.`;save();renderScene(scene);};
  send.addEventListener('click',submit);input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
  document.querySelector('#show-evidence')?.addEventListener('click',()=>renderScene('evidence'));
}

function mockReply(scene,text){
  const t=text.toLowerCase();
  if(scene==='person-a'){
    if(/돈|회계|수리비|정산|적립/.test(t)){ if(state.evidence.includes('E-11')) return '한소영: 그 정산표까지 보셨군요. 제가 문제를 제기한 건 맞아요. 숫자가 이상해서 윤 관리인에게 원본을 따로 보관하라고 했습니다.'; return '한소영: 회계 문제로 언쟁한 적은 있습니다. 하지만 구체적인 자료는 경찰에 확인해 보세요.'; }
    if(/우편|봉투|보내/.test(t)) return '한소영: 윤 관리인이 저녁에 서류를 외부로 보내야 한다고 했어요. 누구에게 보내는지는 말하지 않았습니다.';
    if(/시간|언제|몇 시/.test(t)) return '한소영: 9시 20분쯤 관리실에서 나왔습니다. 그 뒤에는 제 집에 있었습니다.';
  }
  if(scene==='person-b'){
    if(/우편|우편함|봉투/.test(t)){ collectEvidenceSilent('E-09'); return '이준석: 9시 반 조금 넘어서 1층 우편함 근처를 지나갔는데, 관리인 아저씨가 큰 봉투를 들고 있었습니다. 공용 발송함 쪽이었어요.'; }
    if(/사람|누구|봤/.test(t)) return '이준석: 지하 쪽으로 내려가는 사람을 얼핏 본 것 같긴 한데 확실하지 않습니다. 작업복 비슷한 어두운 옷이었어요.';
    if(/시간|몇 시|언제/.test(t)) return '이준석: 배송 완료가 9시 34분으로 찍혀 있을 겁니다. 저는 곧바로 다음 건물로 갔어요.';
  }
  if(scene==='person-c'){
    if(/시간|언제|몇 시|떠났|나갔/.test(t)){ if(state.evidence.includes('E-04')) return '차민규: …패널 기록이 남아 있다고요? 원격 점검 기록일 수도 있습니다. 저는 9시 전에는 작업을 끝낸 걸로 기억합니다.'; return '차민규: 8시 50분 전후로 끝내고 나왔습니다. 늦게까지 있을 이유가 없었습니다.'; }
    if(/cctv|정전|차단|패널/.test(t)){ if(state.evidence.includes('E-07')) return '차민규: CCTV가 같은 회로에 물려 있긴 합니다. 하지만 장애가 났다고 해서 제가 조작했다는 뜻은 아니죠.'; return '차민규: 전기 쪽 문제라면 가능성은 여러 가지입니다. 기록부터 보셔야 할 겁니다.'; }
    if(/수리비|정산|청구|돈/.test(t)) return '차민규: 계약 비용은 관리사무소가 정산합니다. 저는 작업한 만큼 청구했을 뿐입니다.';
    if(/우편|봉투/.test(t)) return '차민규: 우편물은 모릅니다. 제가 왜 그런 걸 신경 쓰겠습니까?';
  }
  if(scene==='police'){
    if(/우편|우편함/.test(t)){ collectEvidenceSilent('E-10'); return '이정훈 형사: 공용 발송함 가장자리에서 찢어진 두꺼운 봉투 조각이 나왔습니다. 내용물은 없었습니다.'; }
    if(/추가|새로운|수사|결과/.test(t)){ collectEvidenceSilent('E-13'); return '이정훈 형사: 피해자 휴대전화 메모에서 “원본은 보내고 사본 보관”이라는 짧은 문장이 확인됐습니다.'; }
    return '이정훈 형사: 확인된 사실과 추정은 구분해서 보십시오. 특히 CCTV가 끊긴 시각 전후가 중요합니다.';
  }
  if(scene==='analyst'){
    if(/사다리|추락|사고/.test(t)) return '서지아 조사관: 사다리 위치와 피해자의 작업 동선이 자연스럽게 맞지 않습니다. 단순 사고라고 단정하기는 어렵습니다.';
    if(/패널|핀|로그|전기/.test(t)){ collectEvidenceSilent('E-12'); return '서지아 조사관: 21시 43분에 설비 패널이 기술자 모드로 열렸습니다. 인증 방식은 개인 작업 PIN입니다.'; }
    if(/정산|수리비|서류/.test(t)){ collectEvidenceSilent('E-11'); return '서지아 조사관: 피해자 파일에서 최근 4개월 수리비 정산표 사본을 복구했습니다. 같은 항목이 반복 청구된 흔적이 있습니다.'; }
    if(/우편|봉투/.test(t)){ collectEvidenceSilent('E-14'); return '서지아 조사관: 발송함 내부 카운터 기록상 21시 52분 무렵 문이 한 차례 다시 열렸습니다. 정상 수거 시간은 아닙니다.'; }
    return '서지아 조사관: 어떤 자료를 기준으로 볼지 말씀해 주세요. 현장, 전기 기록, 문서 자료로 나눠 설명할 수 있습니다.';
  }
  return `${CASE.people[scene].name}: 그 질문만으로는 더 말씀드릴 내용이 없습니다. 다른 기록과 함께 확인해 보시죠.`;
}

function collectEvidence(id){ if(!id||state.evidence.includes(id)) state.feed='이미 확인한 자료입니다.'; else {state.evidence.push(id);state.feed=`${id} 증거가 등록되었습니다.`;} save();refreshStatus();alert(state.feed); }
function collectEvidenceSilent(id){ if(id&&!state.evidence.includes(id)){state.evidence.push(id);state.feed=`새로운 자료 ${id}가 확보되었습니다.`;save();} }
function collectContradiction(id){ if(!state.contradictions.includes(id)){state.contradictions.push(id);state.feed='진술과 기록 사이의 모순을 하나 기록했습니다.';save();alert(state.feed);} else alert('이미 기록한 모순입니다.');refreshStatus(); }

function finalScene(){
  const ready=state.evidence.length>=sealed.evidenceThreshold && state.contradictions.length>=sealed.contradictionThreshold;
  return panel('최종 추리','FINAL DEDUCTION',`
    <div class="lock-notice ${ready?'ready':''}">${ready?'최종 의견서를 제출할 수 있습니다. 정답 선택지가 제공되지 않습니다. 사건 전말을 자신의 문장으로 입증하십시오.':`현재 확보 증거 ${state.evidence.length}/${sealed.evidenceThreshold}, 기록 모순 ${state.contradictions.length}/${sealed.contradictionThreshold}. 성급한 지목을 방지하기 위해 최소 수사 조건이 필요합니다.`}</div>
    <div class="deduction-guide" style="margin-top:18px">
      <div class="guide-card"><strong>범인</strong><br>누가 사건을 일으켰다고 판단하는가?</div>
      <div class="guide-card"><strong>동기</strong><br>그 사람이 왜 행동했는가?</div>
      <div class="guide-card"><strong>방법과 시간</strong><br>어떻게 사건을 만들고 흔적을 감췄는가?</div>
      <div class="guide-card"><strong>입증</strong><br>증거와 진술의 모순을 연결해 설명하십시오.</div>
    </div>
    <textarea id="final-text" class="deduction-area" placeholder="예: 저는 ○○가 범인이라고 판단한다. 그 이유는…\n\n증거 번호를 함께 적어도 좋습니다.">${escapeHtml(state.finalText)}</textarea>
    <div class="submit-row"><span class="submit-hint">범인 이름만 적는 답변은 해결로 인정되지 않습니다.</span><button id="final-submit" class="btn btn-primary" ${ready?'':'disabled'}>최종 의견서 제출</button></div>
    ${state.solved?`<div class="result-box" style="margin-top:18px"><strong>CASE CLOSED · ${state.grade}</strong><br>이 사건은 해결 기록에 저장되었습니다. 사건의 상세 진실은 기록실의 해결 후 문서에서 확인할 수 있습니다.</div>`:''}
  `);
}

function submitFinal(){
  const text=(state.finalText||'').trim();
  if(text.length<120){ alert('최종 의견서가 너무 짧습니다. 범인·동기·방법·핵심 증거를 연결해서 서술해 주세요.'); return; }
  const norm=text.toLowerCase().replace(/\s+/g,' ');
  let score=0;
  if(norm.includes(sealed.culprit)) score+=3;
  sealed.requiredConcepts.forEach(group=>{ if(group.some(k=>norm.includes(k.toLowerCase()))) score+=1; });
  if(/e-?0?[347]|e-?1[124]/i.test(text)) score+=1;
  if(state.contradictions.length>=2) score+=1;
  if(score>=9){state.solved=true;state.grade='S';}
  else if(score>=7){state.solved=true;state.grade='A';}
  else if(score>=5){state.solved=false;state.grade=null;}
  else {state.solved=false;state.grade=null;}
  save();
  if(state.solved){ alert(`사건 해결 성공 · 등급 ${state.grade}\n상세한 사건의 전말은 기록실에서 확인할 수 있습니다.`); renderScene('final'); }
  else alert('현재 의견서만으로는 사건을 입증하기 어렵습니다. 범인 지목뿐 아니라 동기, 범행 과정, CCTV 공백, 핵심 기록을 더 촘촘히 연결해 보세요.');
}

function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}

function showArchive(){
  if(!state.solved){ alert('아직 해결된 사건이 없습니다.'); return; }
  app.innerHTML=`<section class="screen"><article class="scene-card"><header class="scene-header"><div><div class="eyebrow">CASE ARCHIVE</div><h3>${CASE.title}</h3></div></header><div class="scene-body"><div class="result-box"><strong>CASE CLOSED · ${state.grade}</strong><br>사건 요약과 갤러리 구조가 활성화되었습니다. 상세 사진 팩은 다음 제작 단계에서 연결합니다.</div><div style="margin-top:16px"><button class="btn btn-ghost" data-action="replay">처음부터 다시 수사</button></div></div></article></section>`;
}

function resetCase(){ if(!confirm('대화, 증거, 메모, 추리 진행도를 초기화하고 다시 시작할까요?')) return; const solved=state.solved, grade=state.grade; state=defaultState(); state.solved=solved; state.grade=grade; save(); showBriefing(); }

document.addEventListener('click',e=>{
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='open-case') showBriefing();
  if(action==='start-case') showCase();
  if(action==='home') showHome();
  if(action==='archive') showArchive();
  if(action==='replay') resetCase();
  if(action==='settings') alert('Gemini API는 공개 키 노출을 막기 위해 프록시 연동 단계에서 추가합니다.');
});

showHome();
