# CASE FILES v0.0.1

AI 대화가 포함된 사건 팩 기반 추리 어드벤처의 첫 UI/게임 루프 프로토타입입니다.

## 실행

별도 설치 없이 `index.html`을 브라우저에서 열면 됩니다.

## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다. 추천 이름: `case-files`
2. 이 폴더의 파일을 저장소 루트에 업로드합니다.
3. `Settings → Pages`로 이동합니다.
4. `Build and deployment`의 Source를 `Deploy from a branch`로 선택합니다.
5. Branch는 `main`, Folder는 `/(root)`를 선택하고 저장합니다.

## v0.0.1 포함 기능

- 홈 / 사건 선택
- 수사 본부
- 인물 대화 UI 및 로컬 테스트 응답
- 사건 현장 조사
- CCTV 스틸 프레임 UI
- 증거 수집 / 보관함
- 추리 노트(localStorage 저장)
- 최종 추리 UI 골격
- 을씨년스러운 수사 시스템 비주얼 테마

## 다음 버전 후보

- Case Pack JSON 스키마
- 사건 해결/판정 엔진
- 기록실 및 갤러리
- 다시하기 / 최초 해결 기록
- Cloudflare Worker 등을 통한 Gemini API 프록시

> 주의: GitHub Pages에 Gemini API 키를 직접 넣지 마세요. 정적 프론트엔드의 키는 사용자에게 노출될 수 있습니다.
