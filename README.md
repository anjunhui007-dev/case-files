# CASE FILES v0.0.3

개인용 AI 추리 게임 프로토타입.

## GitHub Pages
저장소 루트에 `index.html`, `styles.css`, `app.js`, `assets/`를 그대로 올립니다.
Settings → Pages → Deploy from a branch → `main` / `/(root)`.

## Gemini API
앱의 `설정` 화면에서 API 키를 직접 입력합니다. 키는 소스 파일에 저장되지 않고 현재 브라우저의 localStorage에만 저장됩니다.
공개 저장소에 API 키를 직접 커밋하지 마세요.

기본 모델은 `gemini-2.5-flash`이며 설정에서 모델 ID를 바꿀 수 있습니다.
API가 없거나 호출에 실패하면 로컬 시나리오 응답으로 플레이가 계속됩니다.

## v0.0.3 변경점
- 증거 카드 클릭 시 이미지 + 간단한 설명 모달
- 새 증거에 NEW 표시, 해당 증거를 열람하면 자동 제거
- 새 인물 NEW 표시, 해당 인물 대화를 열면 자동 제거
- CASE 001 atlas 이미지 좌표 크롭 표시
- Gemini REST API 실제 대화 연동
- API 키/모델 설정 및 연결 테스트
- API 실패 시 로컬 대화 fallback
