# 리턴패스 이미지 자산 가이드

리턴패스의 비트맵 이미지는 ChatGPT Image 2로 제작합니다. 화면 안의 제목, 가격, 배지, 버튼 문구는 이미지에 넣지 않고 HTML로 렌더링합니다. 아이콘은 별도 비트맵을 만들지 않고 `lucide-react`를 사용합니다.

## 신규 자산

### 콘텐츠 썸네일

- 파일: `public/images/returnpass-content-thumbnails-v1.webp`
- 구성: 4열 × 3행, 총 12개
- CSS: `background-size: 400% auto`
- 위치 순서:

| 위치 | 콘텐츠 |
|---|---|
| `0% 0%` | 운동 전 전신 워밍업 |
| `33.333% 0%` | 퇴근 후 어깨 스트레칭 |
| `66.666% 0%` | 스쿼트 자세 코칭 |
| `100% 0%` | 필라테스 코어 |
| `0% 50%` | 운동 습관 만들기 |
| `33.333% 50%` | 폼롤러 회복 |
| `66.666% 50%` | PT 상담 |
| `100% 50%` | 한식 감량 식단 |
| `0% 100%` | 단백질 밀프렙 |
| `33.333% 100%` | 초보 전신 서킷 |
| `66.666% 100%` | 요가 유연성 |
| `100% 100%` | 코어 재활 |

### 챌린지 배너

- 파일: `public/images/returnpass-challenge-banners-v1.webp`
- 구성: 1열 × 3행, 총 3개
- CSS: `background-size: auto 300%`
- 위치: 출석 챌린지 `50% 0%`, 유연성 챌린지 `50% 50%`, 걷기 챌린지 `50% 100%`
- 피사체는 오른쪽에 두고 왼쪽 문구 영역은 HTML 그라데이션으로 가독성을 확보합니다.

### AI 코치 비주얼

- 파일: `public/images/returnpass-ai-coach-visuals-v1.webp`
- 구성: 2열 × 1행
- CSS: `background-size: 200% auto`
- 위치: 맞춤 식단 `0% 50%`, 운동 루틴 `100% 50%`

## 기존 자산

### 트레이너 프로필

- 파일: `public/images/returnpass-trainer-portraits-v1.png`
- 구성: 4열 × 2행, 총 8명
- CSS: `background-size: 400% 200%`
- 1행: 김도윤, 이서현, 박민재, 정소민
- 2행: 서지안, 윤태성, 고은채, 이하준
- 실제 인물 사진 대신 일러스트형 인물 자산을 사용합니다.

### 시설 및 서비스

- 시설 카드: `public/images/gym-*.png`, `public/images/facility-*.png`
- 온보딩: `public/images/returnpass-onboarding-hero.png`
- QR 입장: `public/images/returnpass-qr-entry.png`
- 공유 비주얼: `public/images/returnpass-share-art.png`
- 리턴샵 상품: `public/images/returnshop-chicken-breast.png`

## 필요한 신규 자산 (미제작)

리턴샵 상품 10종 중 8종에 사진이 없습니다. 사진이 없는 상품은 화면에서 카테고리 아이콘 타일로 대체하고 있으며,
ChatGPT Image 2로 아래 자산을 제작한 뒤 `src/data/returnpass.ts`의 각 상품 `image` 값을 채우면 그대로 반영됩니다.

- 규격: 800×800, 단색 또는 밝은 배경, 제품만 중앙 배치
- 파일명 예: `public/images/returnshop-<상품id>.png`

| 상품 id | 필요한 이미지 |
|---|---|
| `whey-protein-2kg` | 단백질 보충제 파우더 통 |
| `bcaa-drink` | 아미노산 음료 병 묶음 |
| `shaker-bottle` | 셰이커 보틀 |
| `resistance-band` | 저항 밴드 3종 세트 |
| `lifting-strap` | 리프팅 스트랩 1쌍 |
| `training-tee` | 기능성 반팔 티셔츠 |
| `pickup-towel-set` | 운동 타월 2매 |
| `pickup-protein-shake` | 컵에 담긴 단백질 셰이크 |

`chicken-original`, `chicken-garlic`은 기존 `returnshop-chicken-breast.png`를 함께 사용합니다.

## 제작 규칙

1. 새 비트맵은 ChatGPT Image 2로만 제작합니다.
2. ChatGPT Image 2 원본은 배포 전 WebP로 변환해 로딩 용량을 줄입니다.
3. 사진 안에는 한글, 로고, 가격, 버튼을 넣지 않습니다.
4. UI 아이콘은 `lucide-react`를 우선 사용합니다.
5. 시설 사진은 종목과 공간이 즉시 구분되도록 밝고 실제적인 장면을 사용합니다.
6. 인물 자산은 초상권 문제가 없는 생성 이미지 또는 일러스트만 사용합니다.
7. 기존 파일을 덮어쓰지 않고 `-v2`, `-v3`처럼 버전을 올립니다.
8. 새 스프라이트를 추가하면 `src/data/returnpass.ts`에 이미지 경로와 위치를 함께 기록합니다.
