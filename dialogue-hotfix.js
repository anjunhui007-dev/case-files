// v0.4.1 dialogue hotfix: keep NPC answers tied to the actual question.
(function(){
  const originalGeminiReply = window.geminiReply;
  const originalMockReply = window.mockReply;

  function publicProfileReply(scene, question){
    const q = String(question||'').toLowerCase();
    if(scene !== 'police') return null;
    if(!/(인적|인적사항|신상|프로필|누구|어떤 사람|정보|소개)/.test(q) && !(/한소영/.test(q)&&/이준석/.test(q)&&/차민규/.test(q))) return null;

    const asked=[];
    if(/한소영/.test(q)) asked.push('한소영');
    if(/이준석/.test(q)) asked.push('이준석');
    if(/차민규/.test(q)) asked.push('차민규');
    const people = asked.length ? asked : ['한소영','이준석','차민규'];
    const info={
      '한소영':'입주자대표회 회계 담당으로, 이번 사건에서는 참고인입니다. 피해자와 회계 문제로 언쟁한 적이 있다고 진술했습니다.',
      '이준석':'택배 기사이며 사건 당일 마지막 목격자 후보입니다. 배송 완료 시각은 21시 34분 전후로 확인됩니다.',
      '차민규':'전기 설비 기사로, 사건 당일 세림빌딩 출입 기록이 있습니다. 본인은 20시 50분 전후 작업을 끝내고 나왔다고 진술합니다.'
    };
    return '이정훈 형사: ' + people.map(n=>`${n}은(는) ${info[n]}`).join(' ');
  }

  window.geminiReply = async function(scene, question){
    const fixed = publicProfileReply(scene, question);
    if(fixed) return fixed;
    return originalGeminiReply(scene, question);
  };

  window.mockReply = function(scene, text){
    const fixed = publicProfileReply(scene, text);
    if(fixed) return fixed;
    return originalMockReply(scene, text);
  };
})();
