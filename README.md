# 리턴패스 UI 프로토타입

헬스·요가·필라테스·피트니스 시설을 월 단위로 구독하고, QR 입장부터 PT, 운동 루틴, AI 식단, 상품 주문까지 연결하는 모바일 우선 PWA 스타일 프론트엔드 프로토타입입니다.

현재 버전은 실제 결제, 로그인, 지도 API, Firebase, AI 서버를 연결하지 않고 더미 데이터와 로컬 상태로 서비스 흐름을 검증합니다.

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버에서 `http://localhost:5173/index.source.html`로 접속합니다. 특정 화면은 `?screen=home`, `?screen=pass`, `?screen=adminHome`처럼 화면 id를 붙여 바로 확인할 수 있습니다.

## 배포 빌드

```bash
npm run build
```

빌드 결과는 `docs/`에 생성됩니다. GitHub Pages 루트 배포를 위해 `index.html`, `assets/`, `images/`, `brand/`, `og/`도 함께 갱신됩니다.

## 기술 스택

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react
- sharp 이미지 렌더링 스크립트

## 주요 화면

- 스플래시, 3단계 온보딩, 체험 로그인, 위치 권한 안내
- 개인 대시보드형 홈, 시설 검색과 필터, 시설 상세
- 구독권 선택, 결제 확인, 결제 완료
- 30초 동적 QR 이용권, 구독 관리, 결제 내역
- PT 상담, 주간 운동 루틴, AI 식단
- 리턴샵 상품, 상세, 장바구니, 주문 완료
- 사장님 운영 대시보드, 회원 목록, QR 확인
- 고객센터와 환불 안내, 마이페이지

## 브랜드

- 서비스명: 리턴패스(ReturnPass)
- 슬로건: 운동으로 돌아오는 가장 쉬운 패스
- 딥포레스트: `#12372A`
- 라임: `#D7FF3F`
- 웜화이트: `#F7F6F2`
- 웜샌드: `#E8DCC4`
- 세컨더리 그린: `#2F6F5E`

앱 아이콘, 워드마크, 공유 썸네일은 ChatGPT Image 2로 생성한 PNG 원본을 사용합니다. `npm run build`에서 마스터 원본으로부터 192px·512px PWA 아이콘과 1200×630 카카오톡 공유 이미지를 자동 생성합니다.

- 앱 아이콘 원본: `public/brand/returnpass-icon-master.png`
- 가로형 로고: `public/brand/returnpass-logo.png`
- 공유 이미지 원본: `public/og/returnpass-og-master.png`
- 향후 시설, 트레이너, 콘텐츠, 상품, 챌린지 이미지도 동일하게 ChatGPT Image 2로 제작

## 구현된 보강

- 현재 구독, 다음 결제일, QR 입장, 오늘 루틴, 식단, PT, 상품을 홈에서 확인
- 시설 상세 → 구독권 선택 → 결제 확인 → 완료 → QR 발급 흐름
- 30초 카운트다운, 마스킹 임시 토큰, 캡처 방지, 1회 사용 안내가 포함된 동적 QR UI
- 회원권 상태와 분리된 관리자 QR 검증 상태 및 예외 케이스
- 입장 현황, 운영 알림, 회원 관리, QR 확인, 정산 요약 중심의 사장님 대시보드
- 딥그린·라임·웜화이트 기반 리턴패스 브랜드와 리턴샵 명칭 적용

## 동적 QR 보안 구조

- QR에는 회원권 ID 대신 `gp_live_****_7K2M`처럼 표시되는 서버 검증용 임시 토큰을 사용합니다.
- UI는 30초 카운트다운과 갱신 상태를 표현합니다.
- 캡처본 사용 불가, 1회 스캔 후 폐기, 서버 실시간 검증 안내를 표시합니다.
- 현재는 UI용 더미 상태이며 실제 발급·검증·폐기는 추후 서버 API로 연결합니다.

관리자 QR 검증 상태는 `입장 가능`, `만료된 QR`, `이미 사용된 QR`, `다른 지점 이용권`, `회원권 만료`로 분리되어 있습니다.

## 구조

```text
src/
  App.tsx                 화면 라우팅과 로컬 상태
  components/ui.tsx       버튼, 카드, 배지, 앱 프레임, 하단 탭바
  data/gympass.ts         시설, 구독권, QR, PT, 루틴, 식단, 관리자, 상품 더미 데이터
  types.ts                화면과 도메인 데이터 타입
  styles.css              Tailwind 기본 스타일과 QR 패턴
public/
  brand/                  리턴패스 로고와 PWA 아이콘 원본
  images/                 시설, 히어로, 리턴샵 이미지 자산
  og/                     카카오톡 공유 이미지 원본
scripts/
  render-brand-assets.mjs  공유 이미지와 아이콘 PNG 생성
  publish-pages.mjs        GitHub Pages 배포 파일 복사
```

다음 단계에서는 `src/data/returnpass.ts`와 `src/lib/repo/*` 데이터 계층을 추가해 화면이 더미 저장소와 Firebase 저장소를 같은 인터페이스로 사용할 수 있게 확장합니다.
