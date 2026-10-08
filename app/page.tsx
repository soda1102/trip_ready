"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import TripForm from "./components/TripForm";
import Checklist from "./components/Checklist";
import ProgressBar from "./components/ProgressBar";
import ThemeToggle from "./components/ThemeToggle";

import { createChecklist } from "@/data/checklist";
import { getSeason } from "@/utils/season";
import type { ChecklistItem, TripInfo } from "@/types/trip";

const initialTrip: TripInfo = {
  gender: "",
  travelType: "domestic",
  destination: "",
  startDate: "",
  endDate: "",
};

const STORAGE_KEY = "trip-ready-data";

// 오늘 날짜를 YYYY-MM-DD로 (사용자 기기 시간 기준)
const getToday = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export default function Home() {
  const [trip, setTrip] = useState<TripInfo>(initialTrip);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // 준비물 생성 후 결과 위치로 스크롤
  const resultRef = useRef<HTMLElement>(null);
  const scrollToResult = useRef(false);

  // 저장된 여행 정보 불러오기
  useEffect(() => {
    const today = getToday();

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const data = JSON.parse(saved);

        if (data.trip) {
          setTrip({
            ...data.trip,
            startDate: data.trip.startDate || today,
            endDate: data.trip.endDate || today,
          });
        }
        if (Array.isArray(data.items)) setItems(data.items);
        if (Array.isArray(data.deletedItems)) {
          setDeletedItems(data.deletedItems);
        }
        if (typeof data.generated === "boolean") {
          setGenerated(data.generated);
        }
      } else {
        // 처음 방문: 출발·도착 날짜를 오늘로
        setTrip((prev) => ({ ...prev, startDate: today, endDate: today }));
      }
    } catch {
      console.error("저장된 정보를 불러오지 못했습니다.");
      setTrip((prev) => ({ ...prev, startDate: today, endDate: today }));
    }

    setLoaded(true);
  }, []);

  // 여행 정보 및 체크 상태 자동 저장
  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        trip,
        items,
        generated,
        deletedItems,
      })
    );
  }, [trip, items, generated, deletedItems, loaded]);

  // 준비물 자동 생성
  const generateChecklist = () => {
    if (!trip.gender) {
      alert("성별을 선택해주세요.");
      return;
    }

    if (!trip.destination.trim()) {
      alert("여행지를 입력해주세요.");
      return;
    }

    if (!trip.startDate || !trip.endDate) {
      alert("여행 날짜를 입력해주세요.");
      return;
    }

    if (trip.endDate < trip.startDate) {
      alert("도착 날짜는 출발 날짜 이후여야 합니다.");
      return;
    }

    const season = getSeason(trip.startDate);
    const newChecklist = createChecklist(trip, season);

    // 사용자가 삭제한 기본 준비물 제외
    const filteredChecklist = newChecklist.filter(
      (item) => !deletedItems.includes(item.id)
    );

    // 기존 체크 상태 유지
    const merged = filteredChecklist.map((item) => {
      const existing = items.find((old) => old.id === item.id);

      return existing ? { ...item, checked: existing.checked } : item;
    });

    // 사용자가 직접 추가한 준비물 유지
    const customItems = items.filter((item) => item.custom);

    scrollToResult.current = true;
    setItems([...merged, ...customItems]);
    setGenerated(true);
  };

  // 버튼으로 생성한 직후에만 결과 위치로 이동
  useEffect(() => {
    if (scrollToResult.current && generated) {
      scrollToResult.current = false;
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [items, generated]);

  const completed = items.filter((item) => item.checked).length;

  return (
    <div className="wrap">
      <header>
        <div className="logo">
          <Image
            src="/trip_ready/logo.png"
            alt="트레디 로고"
            width={480}
            height={377}
            className="logo-img"
            priority
          />
          트레디<small>TRIP READY</small>
        </div>
        <ThemeToggle />
      </header>

      {/* 소개 + 여행 정보 입력 */}
      <section className="intro">
        <div className="intro-text">
          <h1>
            떠나기 전,
            <br />
            한 번에 확인!
          </h1>
          <p className="lead">여행 전, <br /> 트레디를 통해 준비물을 빠짐없이 챙겨보세요.</p>
        </div>

        <TripForm
          trip={trip}
          setTrip={setTrip}
          onGenerate={generateChecklist}
        />
      </section>

      {/* 준비물 생성 후: 왼쪽 진행률 + 오른쪽 체크리스트 */}
      {generated && (
        <main className="layout" ref={resultRef}>
          <aside className="side">
            <ProgressBar total={items.length} completed={completed} />
          </aside>

          <Checklist
            items={items}
            setItems={setItems}
            setDeletedItems={setDeletedItems}
          />
        </main>
      )}

      <footer>트레디 · 체크 상태는 이 기기에 저장돼요.</footer>
    </div>
  );
}
