# CASE FILES v0.4.0

- Gemini 기본 모델: gemini-3.6-flash
- 최근 대화만 전달하여 응답 지연 감소
- 자연스러운 한국어 1~3문장 응답 규칙
- 영어 메타/프롬프트/증거 ID 노출 필터
- 12초 초과 시 로컬 시나리오 응답으로 자동 전환
- v0.0.3 저장 데이터 자동 마이그레이션
- app.js?v=0.4.0 캐시 방지
- Atlas v2 4096x2048 좌표 규격을 코드에 선확정

현재는 기존 atlas-case01.png가 계속 표시됩니다. 추후 atlas-case01-v2.png를 생성한 뒤 app.js의 `const ATLAS = LEGACY_ATLAS;`를 `const ATLAS = ATLAS_V2;`로 바꾸면 됩니다.
