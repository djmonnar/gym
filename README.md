# 리턴패스 UI 프로토타입

헬스·요가·필라테스·피트니스 시설을 월 단위로 구독하고, QR 입장부터 PT, 운동 루틴, AI 식단, 상품 주문까지 연결하는 모바일 우선 PWA 스타일 프론트엔드 프로토타입입니다.

현재 버전은 Firebase 앱 초기화까지 연결되어 있으며 화면 데이터는 `src/lib/repo/*`의 더미 저장소를 사용합니다. 실제 로그인, Firestore 읽기·쓰기, Storage 업로드, 결제, 지도 API, AI 서버 호출은 아직 실행하지 않습니다.

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

Vercel 배포에서는 `vercel.json`이 `docs/`를 출력 디렉터리로 사용하고, Vite 기본 경로를 `/`로 자동 전환합니다. GitHub Pages 빌드는 기존 `/gym/` 경로를 유지합니다.

Vercel 프로젝트에는 `.env.example`의 `VITE_FIREBASE_*` 환경변수를 Production, Preview, Development 환경에 등록해야 합니다. 배포 도메인은 Firebase Authentication 승인된 도메인에도 추가합니다.

## 기술 스택

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react
- sharp 이미지 렌더링 스크립트
- Firebase Web SDK

## 주요 화면

- 스플래시, 3단계 온보딩, 체험 로그인, 위치 권한 안내
- 개인 대시보드형 홈, 시설 검색과 필터, 시설 상세
- 구독권 선택, 결제 확인, 결제 완료
- 30초 동적 QR 이용권, 구독 관리, 결제 내역
- 10문항 PT 성향 진단, 유형 코드, 추천 트레이너 Top 3, 프로필, PT 구독과 내 PT
- AI 맞춤 식단·운동 루틴: 입력 폼 → 생성 → 주차별 결과, 장보기 목록의 리턴샵 장바구니 연결, 안전 가드레일과 재생성 횟수 제한
- 본사 콘텐츠 허브: 전체·영상·아티클·식단표·프로그램 탭과 검색으로 콘텐츠 12종 탐색, 유형별 상세(영상 플레이어·아티클 본문·주간 식단·주차별 프로그램), 저장·완료 상태와 PT 전용 잠금
- 커뮤니티: 전체·내 시설·챌린지 피드 탭, 게시물 상세와 댓글, 운동 인증 작성, 챌린지 목록과 진행률 상세
- 리턴샵: 카테고리 필터, 판매 주체 배지, 배송·픽업 선택, 판매자별 장바구니와 배송비 분리, 픽업 안내가 담긴 주문 완료
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
- 요가·필라테스 시설 카드 3종도 ChatGPT Image 2로 제작
- 콘텐츠 12종, 챌린지 3종, AI 식단·루틴 비주얼도 ChatGPT Image 2 스프라이트로 제작
- 자산 위치와 후속 제작 규칙: [`ASSET_GUIDE.md`](ASSET_GUIDE.md)

## Firebase 설정

`src/lib/firebase.ts`에서 Firebase 앱을 초기화합니다. Auth, Firestore, Storage는 초기 번들 크기를 줄이기 위해 실제 사용 시 동적으로 불러옵니다.

```bash
Copy-Item .env.example .env.local
```

`.env.local`에 Firebase 웹 앱 구성값을 입력합니다. 실제 서비스 사용 전 Firebase Console에서 Authentication 제공자, Firestore 데이터베이스, Storage를 각각 활성화하고 보안 규칙을 설정해야 합니다.

Firebase 웹 API 키는 클라이언트에 포함되는 식별값입니다. Google Cloud Console에서 HTTP 리퍼러와 사용 API를 리턴패스 배포 도메인으로 제한하는 것을 권장합니다.

체험 로그인은 Firebase 익명 인증을 사용하므로 Firebase Console의 Authentication에서 익명 제공자를 활성화해야 합니다. 로그인 후 `users/{uid}`에 김예림 체험 회원 프로필을 생성하며, 시설 목록은 Firestore `facilities` 컬렉션을 먼저 조회하고 데이터가 없거나 연결에 실패하면 로컬 더미 데이터로 폴백합니다.

초기 시설 6곳과 구독권 3개를 Firestore에 넣을 때는 Firebase Admin 자격증명을 설정한 뒤 아래 명령을 사용합니다.

```bash
npm run seed:firestore
firebase deploy --only firestore:rules,firestore:indexes,storage
```

시드 명령은 `GOOGLE_APPLICATION_CREDENTIALS` 또는 Google Application Default Credentials를 사용합니다. 서비스 계정 키는 저장소에 커밋하지 않습니다.

## 구현된 보강

- Firebase 익명 체험 로그인, 회원 프로필 생성, Firestore 시설 조회와 더미 데이터 폴백 구조
- 목표·강도·코칭 말투·시간·케어 경험을 반영하는 가중치 기반 PT 매칭과 추천 근거 3줄
- 휴대폰 프레임형 프로토타입을 제거하고 위치·검색·종목·월 가격 중심의 실제 서비스형 시설 탐색 홈과 검색 화면으로 전환
- 현재 구독, 다음 결제일, QR 입장, 오늘 루틴, 식단, PT, 상품을 홈에서 확인
- 시설 상세 → 구독권 선택 → 결제 확인 → 완료 → QR 발급 흐름
- 30초 카운트다운, 마스킹 임시 토큰, 캡처 방지, 1회 사용 안내가 포함된 동적 QR UI
- 회원권 상태와 분리된 관리자 QR 검증 상태 및 예외 케이스
- 입장 현황, 운영 알림, 회원 관리, QR 확인, 정산 요약 중심의 사장님 대시보드
- 딥그린·라임·웜화이트 기반 리턴패스 브랜드와 리턴샵 명칭 적용
- ChatGPT Image 2 콘텐츠·챌린지·AI 코치 비주얼을 실제 화면 데이터에 연결
- 배달앱처럼 빠르게 훑는 콘텐츠 허브: 탭·검색 필터, 추천 비주얼, 콘텐츠별 상세를 선택해 열람하고 저장·완료를 프론트 로컬 상태로 즉시 반영
- 유형별 콘텐츠 상세(영상 챕터·진행률, 아티클 읽기, 주간 식단→AI 식단 CTA, 주차별 프로그램→내 루틴 CTA)와 데모 회원(subscriber) 기준 접근 등급 잠금 및 PT 매칭 연결
- 홈 `오늘 볼 콘텐츠` 카드에서 추천 콘텐츠 상세로 바로 이동
- 커뮤니티 피드 탭이 실제 동작(전체 / 내 시설 / 챌린지 연결 게시물)하고 좋아요는 프론트 로컬 상태로 즉시 반영
- 게시물 상세에서 리포지토리로 댓글을 조회하고 댓글 작성, 참여 챌린지 이동, 신고 접수를 지원
- 운동 인증 작성 화면에서 글 종류·이용 시설·챌린지를 선택해 등록하면 피드 상단에 바로 추가
- 챌린지 3종 목록과 상세에서 내 진행률, 남은 횟수, 리워드, 참여 방법, 참여 인증 게시물을 확인하고 참여·취소
- AI 식단: 성별·연령·목표·활동량·알레르기·건강상태 입력 → 주차별 식단표, 장보기 목록에서 리턴샵 상품을 장바구니로 연결, 대체 제안 제공
- AI 루틴: 목표·빈도·경험·장비·불편한 부위 입력 → 주차별 분할 루틴, 종목별 세트·휴식·대체 종목과 콘텐츠 허브 자세 영상 연결
- AI 안전 가드레일(`src/lib/ai.ts`): 성별 최소 섭취 칼로리 미만 결과 리젝, 임신·수유·당뇨 등은 생성 대신 전문가 상담 안내, 10대 식단 기능 비활성, 건강 정보 별도 동의, 재생성 월 3회 제한과 고지 문구 상시 노출
- 리턴샵 상품 10종을 본사 직판·입점 판매·시설 판매로 나누고 카테고리 5종 필터와 판매 주체 배지를 제공
- 상품별로 택배 배송과 시설 픽업을 선택하며, 지원하지 않는 수령 방식은 선택할 수 없도록 비활성
- 장바구니는 판매자별로 묶여 배송비가 각각 계산됩니다. 픽업 상품에는 배송비를 매기지 않고, 무료배송 임계값까지 남은 금액을 판매자별로 안내합니다(`src/lib/cart.ts`)
- 입점업체·시설 상품에는 통신판매중개 고지와 판매자 사업자 정보를 상품 상세와 장바구니에 표시
- 식품 상품에 원산지·유통기한·영양성분 표시사항을 노출
- 주문 완료 화면에서 픽업 상품은 시설명·인포데스크 위치·운영시간을, 배송 상품은 판매자별 발송 안내를 분리해 안내

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
  components/content/     콘텐츠 허브 전용 컴포넌트(홈, 상세, 썸네일, 메타 헬퍼)
  components/community/   커뮤니티 전용 컴포넌트(피드, 게시물, 작성, 챌린지 목록·상세)
  components/ai/          AI 식단·루틴 화면과 공용 입력·가드레일 컴포넌트
  components/shop/        리턴샵 목록·상세·장바구니·주문완료와 통신판매중개 고지
  lib/ai.ts               AI 생성 인터페이스와 안전 가드레일(서버 연동 시 구현만 교체)
  lib/cart.ts             판매자별 장바구니 그룹과 배송비 분리 계산
  data/returnpass.ts      시설, 구독권, QR, 트레이너, 콘텐츠, AI, 커뮤니티, 상품 더미 데이터
  lib/auth.ts             Firebase 체험 인증과 회원 프로필 생성
  lib/firebase.ts         Firebase 앱 초기화와 지연 로드 서비스
  lib/repo/               Firestore 우선 조회와 더미 폴백 리포지토리 계층
  types.ts                화면과 도메인 데이터 타입
  styles.css              Tailwind 기본 스타일과 QR 패턴
public/
  brand/                  리턴패스 로고와 PWA 아이콘 원본
  design/                 ChatGPT Image 2로 제작한 시설 탐색 UI 레퍼런스
  images/                 시설, 히어로, 리턴샵 이미지 자산
                          ChatGPT Image 2 트레이너 8인 포트레이트 스프라이트 포함
  og/                     카카오톡 공유 이미지 원본
scripts/
  render-brand-assets.mjs  공유 이미지와 아이콘 PNG 생성
  publish-pages.mjs        GitHub Pages 배포 파일 복사
```

다음 단계에서는 신규 screen id와 역할별 라우팅을 추가하고, 이후 Firebase 구현 저장소가 `ReturnPassRepository` 인터페이스를 구현하도록 교체합니다.
