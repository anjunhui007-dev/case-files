# CASE FILES v0.4.1

- Gemini 기본 모델: `gemini-3.6-flash`
- NPC 대화는 Stateless 방식: 과거 Gemini 답변을 다시 입력하지 않음
- 자연스러운 한국어 1~3문장 응답 규칙 및 이상 응답 검증
- 기존 v0.4.0의 오염된 AI 대화 기록은 v0.4.1 최초 실행 시 정리
- API 지연/형식 오류 시 로컬 시나리오 응답으로 안전 전환
- `app.js?v=0.4.1` 캐시 방지
- Atlas v2 활성화: `4096x4096`, 정확한 비중첩 좌표 사용
- Atlas 파일명: `atlas-case01-v2.png`

## Atlas 설치

최종 Atlas 파일 `atlas-case01-v2.png`를 저장소 루트(즉 `app.js`, `index.html`과 같은 위치)에 업로드합니다.

앱은 현재 `const ATLAS = ATLAS_V2;` 상태이므로 별도 코드 수정 없이 해당 파일을 즉시 사용합니다.

권장 파일 조건:

- 크기: 정확히 `4096 x 4096 px`
- 형식: PNG
- 권장 용량: 10MB 이하
- 현재 제작본: 약 2.2MB (GitHub Pages에 부담이 적은 최적화본)

문서형 증거의 중요한 한글은 이미지 생성 모델의 글자를 사용하지 않고 직접 렌더링해 판독성을 유지합니다.
