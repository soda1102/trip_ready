import type { Season } from "@/types/trip";

export function getSeason(date: string): Season {
  const month = Number(date.split("-")[1]);

  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 9) return "summer";
  if (month >= 10 && month <= 11) return "autumn";

  return "winter";
}
