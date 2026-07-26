# Claude 인수인계 프롬프트

아래 내용을 Claude Code에 그대로 전달한다.

```text
너는 `djmonnar/gym` 리턴패스(ReturnPass) 저장소를 이어서 개발하는 시니어 프론트엔드 개발자다.

## 시작 위치

- 로컬 저장소: `C:\Users\djmon\Documents\Codex\2026-05-29\djmonnar-gym`
- 원격 저장소: `https://github.com/djmonnar/gym`
- 반드시 `codex/visual-asset-pack` 브랜치의 최신 커밋 `fd2c0be`에서 시작한다.
- `main`은 시각 자산 브랜치보다 한 커밋 뒤에 있으므로 처음부터 `main`에서 작업하지 않는다.
- 작업 브랜치는 `claude/pr-5-content-hub`로 새로 만든다.

시작 명령:

git fetch origin
git checkout codex/visual-asset-pack
git pull --ff-only
git checkout -b claude/pr-5-content-hub

## 프로젝트 현재 상태

- Vite + React 19 + TypeScript + Tailwind CSS 기반이다. Next.js로 변경하지 않는다.
- 실제 서비스형 반응형 웹 레이아웃이며 휴대폰 목업 프레임으로 되돌리지 않는다.
- 화면 이동은 `?screen=xxx`와 `ScreenId`, `AppShell`, 하단 탭 구조를 사용한다.
- 하단 탭은 홈 / 검색 / 콘텐츠 / 커뮤니티 / 마이다.
- Firebase 앱 초기화, 익명 체험 로그인, Firestore 시설 조회와 로컬 폴백이 연결되어 있다.
- 시설 외 콘텐츠 데이터는 아직 더미 저장소를 사용한다.
- PT 10문항 매칭, 추천 Top 3, 트레이너 프로필, PT 구독 선택·결제·내 PT가 구현되어 있다.
- 콘텐츠 화면은 현재 기본 목록과 단일 상세만 있으므로 이번 PR에서 완성도를 높인다.
- ChatGPT Image 2로 만든 콘텐츠 12종, 챌린지 3종, AI 코치 2종 자산이 연결되어 있다.
- 이미지 규칙과 스프라이트 좌표는 `ASSET_GUIDE.md`를 먼저 읽는다.

## 이번 작업

PR-5 `본사 콘텐츠 허브 고도화`만 구현한다. AI 생성, 샵 확장, 커뮤니티 확장, Firebase 콘텐츠 저장은 이번 범위에 넣지 않는다.

### 1. 콘텐츠 홈

- `contentHome`을 실제 콘텐츠 탐색 화면으로 개선한다.
- 탭: 전체 / 영상 / 아티클 / 식단표 / 프로그램
- `contents` 12개 더미 데이터를 모두 사용한다.
- 추천 콘텐츠 1개를 상단 비주얼로 보여주고, 나머지는 빠르게 탐색 가능한 리스트 또는 그리드로 구성한다.
- 각 카드에 제목, 유형, 난이도, 소요시간, 접근 등급을 표시한다.
- 카드 클릭 시 선택한 콘텐츠가 `contentDetail`에 나타나야 한다. 항상 첫 번째 콘텐츠만 보여주는 현재 동작을 수정한다.
- 검색 또는 태그 필터 하나를 추가하되 모바일에서 답답하지 않게 만든다.

### 2. 콘텐츠 상세

- 콘텐츠 유형별 상세 구성을 분리한다.
- 영상: 실제 재생은 하지 않는 영상 플레이어형 UI, 재생 버튼, 진행률 표시
- 아티클: 읽기 좋은 본문과 예상 읽기 시간
- 식단표: 주간 식단 요약과 AI 식단 화면으로 이동하는 CTA
- 프로그램: 주차별 구성과 내 루틴에 추가하는 CTA
- 저장 버튼과 완료 체크 버튼을 제공한다.
- 저장·완료 상태는 프론트 로컬 상태로 즉시 반영하고 토스트를 띄운다.
- 실제 영상 호스팅, Firebase 쓰기, 서버 API는 추가하지 않는다.

### 3. 접근 등급

- 데모 회원 접근 등급은 `subscriber`로 가정한다.
- `public`, `subscriber` 콘텐츠는 열람 가능하다.
- `pt` 콘텐츠는 미리보기와 잠금 UI를 보여주고 `PT 매칭 시작` 버튼으로 `ptMatchIntro`에 연결한다.
- 잠긴 콘텐츠에서는 완료 처리를 허용하지 않는다.

### 4. 홈 연동

- `home`에 `오늘 할 것` 콘텐츠 카드를 추가하거나 기존 콘텐츠 영역을 개선한다.
- 카드 클릭 시 해당 콘텐츠를 선택한 뒤 `contentDetail`로 이동한다.
- 홈의 기존 구독, QR, 시설 탐색, PT, 식단, 상품 흐름은 유지한다.

### 5. 데이터와 구조

- 화면은 `src/lib/repo/*`를 통해 데이터를 받는 기존 원칙을 유지한다.
- 필요한 더미 필드는 `src/types.ts`와 `src/data/returnpass.ts`에 추가한다.
- 화면에서 Firestore나 `fetch`를 직접 호출하지 않는다.
- 선택 콘텐츠, 탭, 저장 목록, 완료 목록처럼 화면 상태인 값은 React 상태로 관리한다.
- `src/App.tsx`가 더 비대해지지 않도록 콘텐츠 전용 컴포넌트를 `src/components/content/` 아래로 분리해도 된다.
- 기존 사용자 변경이나 다른 화면을 되돌리지 않는다.

## 디자인 규칙

- 브랜드: 딥그린 `#12372A`, 라임 `#D7FF3F`, 웜화이트 `#F7F6F2`
- 색상은 기존 Tailwind 토큰을 사용하고 임의 색상 하드코딩을 늘리지 않는다.
- 배달앱에서 상품을 찾듯 콘텐츠를 빠르게 훑을 수 있는 정보 구조를 만든다.
- 모바일 우선이되 데스크톱에서도 중앙에 작은 휴대폰처럼 보이지 않게 기존 반응형 폭을 유지한다.
- 중첩 카드와 과도한 큰 제목을 피한다.
- UI 아이콘은 `lucide-react`만 사용한다.
- 새 이미지가 꼭 필요하지 않다. 기존 ChatGPT Image 2 자산을 우선 사용한다.
- 추가 비트맵이 정말 필요해도 다른 이미지 생성 모델은 사용하지 말고 작업을 멈춘 뒤 필요 자산을 보고한다.
- 모든 화면 텍스트는 한국어로 작성한다.

## 확인할 파일

- `ASSET_GUIDE.md`
- `README.md`
- `src/App.tsx`
- `src/types.ts`
- `src/data/returnpass.ts`
- `src/lib/repo/contracts.ts`
- `src/lib/repo/mockReturnPassRepository.ts`
- `src/components/ui.tsx`

## 완료 조건

- `contentHome` 탭과 필터가 실제로 동작한다.
- 서로 다른 콘텐츠 카드를 누르면 맞는 상세 내용이 표시된다.
- 저장과 완료 상태가 화면에서 동작한다.
- 접근 등급 잠금과 PT CTA가 동작한다.
- 홈에서 추천 콘텐츠 상세로 이동할 수 있다.
- 기존 시설 검색, 결제, QR, PT, AI, 샵, 관리자 화면 이동이 깨지지 않는다.
- `npm run test:matching` 통과
- `npm run build` 통과
- 검수는 `home`, `contentHome`, `contentDetail`의 모바일·데스크톱 핵심 상태만 확인한다. 불필요한 전 화면 검수는 하지 않는다.
- README의 주요 화면과 구현된 보강에 콘텐츠 허브 내용을 업데이트한다.

## Git 마무리

- 변경 범위를 확인하고 관련 파일만 커밋한다.
- 커밋 메시지: `Build ReturnPass content hub`
- `claude/pr-5-content-hub` 브랜치를 원격에 푸시한다.
- 빌드와 테스트가 모두 통과하고 충돌이 없을 때만 `main`에 병합하고 푸시한다.
- Vercel 배포가 연결되어 있으면 배포 상태를 확인한다.
- 마지막 보고에는 변경 파일, 구현 기능, 테스트 결과, 커밋 해시, 병합·배포 여부를 짧게 적는다.

먼저 저장소와 `ASSET_GUIDE.md`를 읽고 기존 구조를 파악한 다음 바로 구현을 시작하라. 계획만 제시하고 멈추지 마라.
```

