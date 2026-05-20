# 짐패스 UI 프로토타입

헬스장을 1년권이 아니라 한 달씩 구독하는 모바일 우선 PWA 스타일 웹앱 프로토타입입니다. 실제 PG 결제, 지도 API, 로그인 API, 백엔드 연동은 포함하지 않고 더미 데이터와 로컬 상태로 화면 흐름을 구현했습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하면 됩니다.
개발 서버에서는 `http://localhost:5173/index.source.html`이 소스 앱 진입점입니다.

## GitHub Pages 배포

```bash
npm run build
```

빌드 결과는 `docs/` 폴더에 생성됩니다. GitHub Pages는 `main` 브랜치의 `/docs` 폴더를 배포 대상으로 사용하면 `https://djmonnar.github.io/gym/`에서 바로 열립니다.
현재 레포는 Pages가 `main` 브랜치 루트를 보더라도 앱이 뜨도록 빌드된 `index.html`, `assets/`, `images/`도 함께 갱신합니다.

## 기술 스택

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react

## 주요 화면

- 스플래시, 온보딩, 로그인, 위치 권한 안내
- 홈, 헬스장 검색/필터, 헬스장 상세
- 구독권 선택, 결제 확인, 결제 완료
- 내 이용권 QR, 구독 관리, 결제 내역
- 고객센터/환불 안내, 마이페이지
- GYMSHOP 상품판매 패널, 닭가슴살 상품 상세, 장바구니, 구매 완료
- 사장님 관리자 홈, 관리자 회원 목록, 관리자 QR 확인
- 짐패스 SVG 로고, PWA 아이콘, 카카오톡 공유 전용 1200×630 썸네일

## 구조

```text
src/
  App.tsx                 전체 화면 라우팅과 로컬 상태
  components/ui.tsx       버튼, 카드, 배지, 앱 프레임, 하단 탭바
  data/gympass.ts         헬스장, 구독권, 결제 내역, 관리자 더미 데이터
  types.ts                화면과 데이터 타입
  styles.css              Tailwind와 QR placeholder 스타일
public/images/            생성한 헬스장 사진 자산
```

## 구현 메모

- 데스크톱에서는 중앙 모바일 앱 프레임으로 보이도록 구성했습니다.
- 하단 탭바는 홈, 검색, 이용권, 구독관리, 마이로 고정되어 있습니다.
- 결제 버튼은 실제 결제 없이 약관 동의 상태만 확인하고 결제 완료 화면으로 이동합니다.
- 구독 해지 예약은 안내 모달과 토스트로 처리합니다.
- GYMSHOP은 닭가슴살 상품 1개를 실제 판매 화면처럼 구성하고, 수량 변경과 장바구니, 더미 구매 완료 흐름을 포함합니다.
- 카카오톡 공유 썸네일은 `public/og/kakao-thumbnail.svg` 원본에서 `public/og/kakao-thumbnail.png`로 자동 렌더링됩니다.
- 관리자 화면은 마이페이지의 `사장님 관리자 화면 보기` 버튼으로 진입할 수 있습니다.
