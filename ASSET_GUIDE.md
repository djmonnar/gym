# 리턴패스 이미지 자산 가이드

리턴패스의 비트맵 이미지는 ChatGPT Image 2로 제작합니다. 화면 안의 제목, 가격, 배지, 버튼 문구는 이미지에 넣지 않고 HTML로 렌더링합니다. 아이콘은 별도 비트맵을 만들지 않고 `lucide-react`를 사용합니다.

## 신규 자산

### 콘텐츠 썸네일

- 원본 스프라이트: `public/images/returnpass-content-thumbnails-v1.webp` (4열 × 3행, 1448×1086)
- **개별 이미지로 분리해 사용**: `public/images/content/content-cell-<row><col>.webp` (362×362, 총 12개)
  - 분리 스크립트: `scripts/slice-content-thumbnails.mjs`
  - 렌더링: `<img object-cover>` (예전 스프라이트 + background-position 방식은 컨테이너 종횡비가 칸과 다를 때 피사체가 잘려서 교체함)
  - 데이터 매핑: `src/data/returnpass.ts`의 `contentThumbnail(position)`가 위치 문자열을 셀 파일로 변환
- 아래 위치 순서는 원본 스프라이트 기준(row=y/50, col=x/33.333로 셀을 계산):

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

## 리턴샵 상품 사진

GPT Image 2(ChatGPT Image 2)로 제작하며, 아래 프롬프트 공식을 그대로 써야 상품 간 톤이 일관됩니다.

```
Product photograph of a <상품 설명>, centered on a seamless warm off-white background.
Soft diffused studio lighting from the upper left, gentle natural shadow beneath.
Clean minimal e-commerce catalog style, <앵글>.
The surface is completely blank with no text, no letters, no numbers, no Korean characters,
no logos, no labels, no stickers and no graphics of any kind.
Photorealistic, sharp focus, neutral color grading, no props, no hands, no people.
```

- 규격: 800×800 WebP (2k로 생성 후 `sharp`로 변환)
- 브랜드 액센트가 필요한 상품(뚜껑 등)은 딥그린 계열로 지정
- 화면은 `object-contain`으로 담으므로 배경 여백이 잘리지 않습니다

### 제작 완료

| 상품 id | 파일 |
|---|---|
| `chicken-original`, `chicken-garlic` | `returnshop-chicken-breast-v2.webp` |
| `whey-protein-2kg` | `returnshop-whey-protein.webp` |
| `shaker-bottle` | `returnshop-shaker-bottle.webp` |
| `training-tee` | `returnshop-training-tee.webp` |

> `returnshop-chicken-breast.png`(구버전)에는 리브랜딩 전 `GYMSHOP` 워드마크와 한글이 박혀 있어
> 규칙 3 위반이었습니다. `-v2.webp`로 교체했으므로 구버전은 사용하지 않습니다.

### 미제작

| 상품 id | 필요한 이미지 |
|---|---|
| `bcaa-drink` | 아미노산 음료 병 묶음 |
| `resistance-band` | 저항 밴드 3종 세트 |
| `lifting-strap` | 리프팅 스트랩 1쌍 |
| `pickup-towel-set` | 운동 타월 2매 |
| `pickup-protein-shake` | 컵에 담긴 단백질 셰이크 |

## 제작 규칙

1. 새 비트맵은 ChatGPT Image 2로만 제작합니다.
2. ChatGPT Image 2 원본은 배포 전 WebP로 변환해 로딩 용량을 줄입니다.
3. 사진 안에는 한글, 로고, 가격, 버튼을 넣지 않습니다.
4. UI 아이콘은 `lucide-react`를 우선 사용합니다.
5. 시설 사진은 종목과 공간이 즉시 구분되도록 밝고 실제적인 장면을 사용합니다.
6. 인물 자산은 초상권 문제가 없는 생성 이미지 또는 일러스트만 사용합니다.
7. 기존 파일을 덮어쓰지 않고 `-v2`, `-v3`처럼 버전을 올립니다.
8. 새 스프라이트를 추가하면 `src/data/returnpass.ts`에 이미지 경로와 위치를 함께 기록합니다.
