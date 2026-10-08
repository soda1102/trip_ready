import type {
  ChecklistItem,
  TripInfo,
  Season,
} from "@/types/trip";

// 카테고리
export const categories = [
  "의류",
  "세면도구",
  "화장품",
  "전자기기",
  "의약품",
  "신분증",
  "기타",
];

type ItemData = {
  category: string;
  name: string;
};

// 카테고리 별 챙길 항목
const commonItems: ItemData[] = [
  { category: "의류", name: "속옷" },
  { category: "의류", name: "양말" },
  { category: "의류", name: "잠옷" },
  { category: "의류", name: "상의" },
  { category: "의류", name: "하의" },

  { category: "세면도구", name: "칫솔" },
  { category: "세면도구", name: "치약" },
  { category: "세면도구", name: "치간칫솔" },
  { category: "세면도구", name: "샴푸" },
  { category: "세면도구", name: "트리트먼트" },
  { category: "세면도구", name: "바디워시" },

  { category: "화장품", name: "스킨 / 토너" },
  { category: "화장품", name: "로션 / 크림" },
  { category: "화장품", name: "선크림" },

  { category: "전자기기", name: "휴대폰 충전기" },
  { category: "전자기기", name: "워치 충전기" },
  { category: "전자기기", name: "보조배터리" },
  { category: "전자기기", name: "이어폰" },

  { category: "의약품", name: "소화제" },
  { category: "의약품", name: "유산균" },
  { category: "의약품", name: "개인 복용약" },

  { category: "기타", name: "지갑" },
  { category: "기타", name: "안경" },
  
];

// 국내 추가 확인
const domesticItems: ItemData[] = [
  { category: "신분증", name: "신분증" },
  { category: "기타", name: "숙소 예약 확인" },
  { category: "기타", name: "숙소 주차 여부" },
];

// 해외 추가 확인
const internationalItems: ItemData[] = [
  { category: "신분증", name: "여권" },
  { category: "신분증", name: "여권 사본" },
  { category: "신분증", name: "항공권" },
  { category: "기타", name: "해외 결제 카드" },
  { category: "기타", name: "여행자 보험 확인" },
  { category: "전자기기", name: "해외용 어댑터" },
];

// 여성 용품 확인
const femaleItems: ItemData[] = [
  { category: "화장품", name: "아이브로우" },
  { category: "화장품", name: "아이라이너" },
  { category: "화장품", name: "마스카라" },
  { category: "화장품", name: "뷰러" },
  { category: "화장품", name: "파우더" },
  { category: "화장품", name: "쉐딩" },
  { category: "화장품", name: "하이라이터" },
  { category: "화장품", name: "기름종이" },
  { category: "화장품", name: "브러쉬" },
  { category: "기타", name: "헤어집게" },
  { category: "기타", name: "헤어롤" },
  { category: "기타", name: "헤어브러쉬" },
  { category: "기타", name: "생리용품" },
];

// 남성 용품 확인
const maleItems: ItemData[] = [
  { category: "세면도구", name: "면도기" },
  { category: "세면도구", name: "쉐이빙 제품" },
];

// 계절별 추가 확인
const seasonalItems: Record<Season, ItemData[]> = {
  spring: [
    { category: "의류", name: "가벼운 겉옷" },
  ],
  summer: [
    { category: "의류", name: "반팔" },
    { category: "의류", name: "얇은 옷" },
    { category: "기타", name: "선글라스" },
    { category: "기타", name: "모자" },
    { category: "기타", name: "양산" },
    { category: "기타", name: "우산" },
  ],
  autumn: [
    { category: "의류", name: "가디건" },
    { category: "의류", name: "긴팔" },
  ],
  winter: [
    { category: "의류", name: "패딩 / 코트" },
    { category: "의류", name: "목도리" },
    { category: "의류", name: "장갑" },
    { category: "기타", name: "핫팩" },
  ],
};

export function createChecklist(
  trip: TripInfo,
  season: Season
): ChecklistItem[] {
  const items: ItemData[] = [...commonItems];

  if (trip.travelType === "domestic") {
    items.push(...domesticItems);
  } else {
    items.push(...internationalItems);
  }

  if (trip.gender === "female") {
    items.push(...femaleItems);
  } else if (trip.gender === "male") {
    items.push(...maleItems);
  }

  items.push(...seasonalItems[season]);

  // 중복된 준비물 제거
  const uniqueItems = items.filter(
    (item, index, array) =>
      array.findIndex(
        (target) =>
          target.category === item.category &&
          target.name === item.name
      ) === index
  );

  return uniqueItems.map((item) => ({
    ...item,
    id: `${item.category}-${item.name}`,
    checked: false,
  }));
}
