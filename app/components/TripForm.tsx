"use client";

import type { TripInfo } from "@/types/trip";

interface Props {
  trip: TripInfo;
  setTrip: (trip: TripInfo) => void;
  onGenerate: () => void;
}

export default function TripForm({
  trip,
  setTrip,
  onGenerate,
}: Props) {
  const updateTrip = (field: keyof TripInfo, value: string) => {
    const next = { ...trip, [field]: value };

    // 출발일을 도착일보다 늦게 고르면 도착일도 같이 맞춤
    if (field === "startDate" && next.endDate < value) {
      next.endDate = value;
    }

    setTrip(next);
  };

  return (
    <section className="trip-form">
      <h2>여행 정보</h2>

      <div className="row">
        <div className="field">
          <label htmlFor="gender">성별</label>
          <select
            id="gender"
            value={trip.gender}
            onChange={(e) => updateTrip("gender", e.target.value)}
            required
          >
            <option value="" disabled>
              성별을 선택해주세요
            </option>
            <option value="female">여성</option>
            <option value="male">남성</option>
          </select>
        </div>

        <div className="field">
          <span id="travelType-label">여행 유형</span>
          <div className="seg" role="group" aria-labelledby="travelType-label">
            <button
              type="button"
              aria-pressed={trip.travelType === "domestic"}
              onClick={() => updateTrip("travelType", "domestic")}
            >
              국내
            </button>
            <button
              type="button"
              aria-pressed={trip.travelType === "international"}
              onClick={() => updateTrip("travelType", "international")}
            >
              해외
            </button>
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="destination">여행지</label>
        <input
          id="destination"
          type="text"
          value={trip.destination}
          onChange={(e) => updateTrip("destination", e.target.value)}
          placeholder="도시를 입력하세요"
        />
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="startDate">출발 날짜</label>
          <input
            id="startDate"
            type="date"
            value={trip.startDate}
            onChange={(e) => updateTrip("startDate", e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="endDate">도착 날짜</label>
          <input
            id="endDate"
            type="date"
            min={trip.startDate}
            value={trip.endDate}
            onChange={(e) => updateTrip("endDate", e.target.value)}
          />
        </div>
      </div>

      <button type="button" className="submit" onClick={onGenerate}>
        준비물 생성하기
      </button>
    </section>
  );
}
