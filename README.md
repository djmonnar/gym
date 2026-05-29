# 짐패스 UI 프로토타입

헬스장을 1년권이 아니라 한 달씩 구독하고 QR로 바로 입장하는 모바일 우선 PWA 스타일 프론트엔드 프로토타입입니다. 기존 `index`의 사진 자산과 블랙/레드 피트니스 무드는 유지하면서, 월구독 서비스에 필요한 가격 비교, 결제 확인, QR 이용권, 구독 관리, 환불 안내, 사장님 관리자 화면을 더미 데이터와 로컬 상태로 구현했습니다.

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버에서는 `http://localhost:5173/index.source.html`로 접속하면 됩니다.
특정 화면을 바로 확인하려면 `?screen=home`, `?screen=shop`, `?screen=shopDetail`처럼 화면 id를 붙일 수 있습니다.

## 배포 빌드

```bash
npm run build
```

빌드 결과는 `docs/`에 생성되고, GitHub Pages 루트 배포도 동작하도록 `index.html`, `assets/`, `images/`, `brand/`, `og/`가 함께 갱신됩니다.

## 기술 스택

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react
- sharp 이미지 렌더링 스크립트

## 주요 화면

- 스플래시, 온보딩, 로그인, 위치 권한 안내
- 홈, 헬스장 검색/필터, 헬스장 상세
- 구독권 선택, 결제 확인, 결제 완료
- 내 이용권 QR, 구독 관리, 결제 내역
- 고객센터/환불 안내, 마이페이지
- 사장님 관리자 홈, 회원 목록, QR 확인
- GYMSHOP 상품 판매 패널, 닭가슴살 상세, 장바구니, 구매 완료

## 이번 보강 방향

- 기존 홈/검색 카드의 실제 사진과 블랙/레드 무드를 유지
- 헬스장 리스트에서 월 가격, 거리, 운영시간을 즉시 비교
- 홈에서 구독 상태, 다음 결제일, QR 이용권 진입을 명확하게 노출
- 구독 관리에서 다음 결제일, 결제 예정 금액, 결제 수단, 해지/환불 요약을 분리
- 관리자 홈에 오늘 입장, QR 확인 필요, 환불 문의, 결제 실패 회원 같은 운영 지표 추가
- 실제 결제, 로그인, 지도 API, 백엔드 연동 없이 더미 데이터만 사용

## 디자인 방향

- 블랙/레드 톤의 강렬한 피트니스 구독 앱 무드
- 모바일 앱 프레임과 플로팅 하단 탭바
- 구독 상태, 다음 결제일, QR 입장을 홈 첫 화면에서 즉시 확인
- 실제 이미지 자산을 활용한 홈 히어로, 상품 이미지, 카카오톡 공유 썸네일
- 카카오톡 공유 썸네일은 `public/og/kakao-thumbnail.svg`를 원본으로 `public/og/kakao-thumbnail.png`가 자동 생성됩니다.
- 추후 Firebase, 결제 SDK, 지도 API 연동을 위해 화면 상태와 더미 데이터를 `src/App.tsx`, `src/data/gympass.ts`, `src/types.ts`로 분리했습니다.

## 구조

```text
src/
  App.tsx                 전체 화면 라우팅과 로컬 상태
  components/ui.tsx       버튼, 카드, 배지, 앱 프레임, 하단 탭바
  data/gympass.ts         헬스장, 구독권, 결제 내역, 관리자, 상품 더미 데이터
  types.ts                화면과 데이터 타입
  styles.css              Tailwind 기본 스타일과 QR placeholder
public/
  brand/                  짐패스 로고와 PWA 아이콘
  images/                 헬스장/히어로/GYMSHOP 이미지 자산
  og/                     카카오톡 공유 썸네일
scripts/
  render-brand-assets.mjs  썸네일과 아이콘 PNG 생성
  publish-pages.mjs        GitHub Pages 루트 배포 파일 복사
```
