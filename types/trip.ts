// 성별
export type Gender = "female" | "male";

// 국내, 해외
export type TravelType = "domestic" | "international";

// 계절
export type Season = "spring" | "summer" | "autumn" | "winter";

// 선택 타입
export interface TripInfo {
  gender: Gender | "";
  travelType: TravelType;
  destination: string;
  startDate: string;
}

// 체크리스트
export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
  custom?: boolean;
}
