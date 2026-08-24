const app = document.querySelector('#app');

const state = JSON.parse(localStorage.getItem('casefiles-v001') || 'null') || {
  evidence: ['E-01', 'E-02'],
  contradictions: [],
  notes: '',
  feed: '사건 파일이 열렸습니다.',
  chats: {
    'person-a': [
      { who: 'npc', text: '김서연: …무엇부터 말씀드리면 될까요?' }
    ],
    'person-b': [
      { who: 'npc', text: '박민우: 저는 그날 늦게까지 회사에 있었습니다.' }
    ],
    'police': [
      { who: 'npc', text: '담당 형사: 현재까지 외부 침입 흔적은 확인되지 않았습니다.' }
    ],
    'analyst': [
      { who: 'npc', text: '조사원: 확보된 자료라면 제가 아는 범위에서 설명드리겠습니다.' }
    ]
  }
};

function save() {
  localStorage.setItem('casefiles-v001', JSON.stringify(state));
}

function mountTemplate(id) {
  const t = document.querySelector(id);
  app.replaceChildren(t.content.cloneNode(true));
}

function showHome() {
  mountTemplate('#home-template');
}

function showCase() {
  mountTemplate('#case-template');
  document.querySelectorAll('.nav-item[data-scene]').forEach(btn => {
    btn.addEventListener('click', () => renderScene(btn.dataset.scene));
  });
  renderScene('hub');
  refreshStatus();
}

function setActiveScene(scene) {
  document.querySelectorAll('.nav-item[data-scene]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scene === scene);
  });
}

function refreshStatus() {
  const e = document.querySelector('#metric-evidence');
  const c = document.querySelector('#metric-contradictions');
  const p = document.querySelector('#progress-bar');
  const f = document.querySelector('#recent-feed');
  if (e) e.textContent = `${String(state.evidence.length).padStart(2,'0')} / 12`;
  if (c) c.textContent = `${String(state.contradictions.length).padStart(2,'0')} / ??`;
  if (p) p.style.width = `${Math.min(90, 12 + state.evidence.length * 7 + state.contradictions.length * 8)}%`;
  if (f) f.textContent = state.feed;
}

function panel(title, eyebrow, body) {
  return `<article class="scene-card"><header class="scene-header"><div><div class="eyebrow">${eyebrow}</div><h3>${title}</h3></div></header><div class="scene-body">${body}</div></article>`;
}

function renderScene(scene) {
  setActiveScene(scene);
  const target = document.querySelector('#scene-content');
  if (!target) return;

  const scenes = {
    hub: () => panel('수사 본부', 'INVESTIGATION HUB', `
      <div class="hero-scene">
        <div class="hero-scene-copy">
          <div class="eyebrow">CURRENT NOTICE</div>
          <h2>현장 감식이 시작되었습니다.</h2>
          <p>인물 진술과 현장 자료를 따로 보지 마십시오. 서로 맞지 않는 시점과 물건을 기록하는 것이 핵심입니다.</p>
        </div>
      </div>
      <div class="action-grid">
        <button class="action-card" data-jump="person-a"><strong>김서연과 대화</strong><span>참고인 진술 확인</span></button>
        <button class="action-card" data-jump="scene"><strong>사건 현장</strong><span>402호 거실 조사</span></button>
        <button class="action-card" data-jump="police"><strong>경찰 수사 현황</strong><span>공식 수사 정보 확인</span></button>
        <button class="action-card" data-jump="cctv"><strong>CCTV 기록</strong><span>로비 영상 검토</span></button>
      </div>
    `),
    scene: () => panel('402호 거실', 'CRIME SCENE', `
      <div class="hero-scene"><div class="hero-scene-copy"><h2>사건 현장</h2><p>방 전체를 먼저 확인한 뒤 관심 지점을 조사하십시오.</p></div></div>
      <div class="action-grid">
        <button class="action-card inspect" data-evidence="E-03"><strong>책상 아래 조사</strong><span>바닥에 금속성 물체가 보입니다.</span></button>
        <button class="action-card"><strong>창문 조사</strong><span>잠금 장치 상태 확인</span></button>
        <button class="action-card"><strong>현관 조사</strong><span>외부 침입 흔적 확인</span></button>
        <button class="action-card"><strong>소파 주변 조사</strong><span>특이사항 없음</span></button>
      </div>
    `),
    cctv: () => panel('건물 로비 CCTV', 'CAMERA 02', `
      <div class="hero-scene" style="filter:grayscale(1) contrast(1.15);"><div class="hero-scene-copy"><div class="eyebrow">21:38:17</div><h2>CAM 02 / MAIN LOBBY</h2><p>현재 버전에서는 스틸 프레임 방식으로 구현되었습니다.</p></div></div>
      <div class="action-grid">
        <button class="action-card inspect" data-evidence="E-04"><strong>21:38 프레임 저장</strong><span>우산을 든 인물이 포착됨</span></button>
        <button class="action-card"><strong>21:47 프레임</strong><span>로비는 비어 있음</span></button>
      </div>
    `),
    evidence: () => panel('증거 보관함', 'EVIDENCE', `
      <div class="evidence-grid">
        ${['E-01 피해자 휴대전화','E-02 현관 출입기록','E-03 깨진 손목시계','E-04 로비 CCTV 프레임','E-05 혈액 검사 결과','E-06 우산'].map(item => {
          const id = item.split(' ')[0];
          const locked = !state.evidence.includes(id);
          return `<div class="evidence-card" style="opacity:${locked ? .34 : 1}"><strong>${locked ? '미확보 자료' : item}</strong><small>${locked ? 'LOCKED' : '확보 완료'}</small></div>`;
        }).join('')}
      </div>
    `),
    notes: () => panel('추리 노트', 'DEDUCTION NOTES', `
      <textarea id="notes" class="note-area" placeholder="시간대, 진술의 모순, 확인할 사항을 기록하십시오.">${state.notes}</textarea>
    `),
    final: () => panel('최종 추리', 'FINAL DEDUCTION', `
      <div class="lock-notice">v0.0.1에서는 최종 추리 UI만 구현되어 있습니다. 실제 사건 팩에서는 최소 수사 조건 충족 후 제출 가능합니다.</div>
      <div class="final-grid" style="margin-top:18px">
        <label>범인<select><option>선택</option><option>김서연</option><option>박민우</option><option>최도현</option></select></label>
        <label>동기<select><option>선택</option><option>금전 문제</option><option>비밀 은폐</option><option>우발적 충돌</option></select></label>
        <label>범행 방법<select><option>선택</option><option>약물 사용</option><option>추락 위장</option><option>직접 공격</option></select></label>
        <button class="btn btn-primary" id="fake-submit">결론 제출</button>
      </div>
    `)
  };

  if (['person-a','person-b','police','analyst'].includes(scene)) {
    target.innerHTML = dialogueScene(scene);
    wireDialogue(scene);
  } else {
    target.innerHTML = (scenes[scene] || scenes.hub)();
  }

  target.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', () => renderScene(btn.dataset.jump)));
  target.querySelectorAll('.inspect').forEach(btn => btn.addEventListener('click', () => collectEvidence(btn.dataset.evidence)));

  const notes = document.querySelector('#notes');
  if (notes) notes.addEventListener('input', e => { state.notes = e.target.value; save(); });
  const submit = document.querySelector('#fake-submit');
  if (submit) submit.addEventListener('click', () => alert('v0.0.1 프로토타입: 판정 엔진은 다음 단계에서 사건 팩과 함께 연결합니다.'));

  refreshStatus();
}

function dialogueScene(scene) {
  const meta = {
    'person-a': ['김서연', '참고인 / 긴장 상태'],
    'person-b': ['박민우', '용의자 / 진술 확인 필요'],
    'police': ['이정훈 형사', '담당 형사 / 공식 브리핑'],
    'analyst': ['감식 조사원', '증거 분석 담당']
  }[scene];
  const messages = state.chats[scene].map(m => `<div class="message ${m.who === 'player' ? 'player' : ''}">${escapeHtml(m.text)}</div>`).join('');
  return `<article class="scene-card dialogue-layout">
    <aside class="portrait-panel"><div class="portrait"><div><div class="eyebrow">INTERVIEW SUBJECT</div><strong>${meta[0]}</strong><p class="subtle">${meta[1]}</p></div></div></aside>
    <section class="chat-panel"><header class="scene-header"><div><div class="eyebrow">INTERVIEW LOG</div><h3>${meta[0]}</h3></div></header><div class="chat-log">${messages}</div>
    <div class="chat-controls"><button class="btn btn-ghost">증거 제시</button><input id="chat-input" placeholder="질문 입력…"><button id="send-chat" class="btn btn-primary">전송</button></div></section>
  </article>`;
}

function wireDialogue(scene) {
  const input = document.querySelector('#chat-input');
  const send = document.querySelector('#send-chat');
  const submit = () => {
    const text = input.value.trim();
    if (!text) return;
    state.chats[scene].push({ who: 'player', text });
    state.chats[scene].push({ who: 'npc', text: mockReply(scene, text) });
    state.feed = '새로운 대화가 기록되었습니다.';
    save();
    renderScene(scene);
  };
  send.addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

function mockReply(scene, text) {
  if (/우산|비/.test(text)) return scene === 'person-a' ? '김서연: 우산이요? …검은색이었던 것 같아요. 정확히는 기억나지 않아요.' : '현재 프로토타입에서는 미리 준비된 응답으로 동작합니다.';
  if (/시간|몇 시|언제/.test(text)) return scene === 'person-b' ? '박민우: 9시 반쯤까지 회사에 있었습니다. 그 뒤에는 곧바로 집으로 갔고요.' : '시간대는 수사 기록과 함께 비교해 보시는 게 좋겠습니다.';
  return scene === 'police' ? '이정훈 형사: 확인된 사실과 추정은 구분해서 보셔야 합니다.' : '현재 v0.0.1은 대화 화면 테스트용 응답입니다. 실제 버전에서는 사건 팩의 공개 조건을 만족한 정보만 AI에게 전달합니다.';
}

function collectEvidence(id) {
  if (!id || state.evidence.includes(id)) {
    state.feed = '이미 확인한 자료입니다.';
  } else {
    state.evidence.push(id);
    state.feed = `${id} 증거가 등록되었습니다.`;
  }
  save();
  refreshStatus();
  alert(state.feed);
}

function escapeHtml(s) {
  return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}

document.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'open-case') showCase();
  if (action === 'home') showHome();
  if (action === 'archive') alert('사건 기록실은 v0.0.2에서 실제 해결 기록과 갤러리를 연결합니다.');
  if (action === 'settings') alert('Gemini API 설정은 키 보호를 위해 Worker 연동 버전에서 추가합니다.');
});

showHome();
