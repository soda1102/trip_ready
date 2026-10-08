"use client";

import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { ChecklistItem } from "@/types/trip";

interface Props {
  items: ChecklistItem[];
  setItems: Dispatch<SetStateAction<ChecklistItem[]>>;
  setDeletedItems: Dispatch<SetStateAction<string[]>>;
}

type Tab = "list" | "add" | "settings";

const TABS: { key: Tab; label: string }[] = [
  { key: "list", label: "체크리스트" },
  { key: "add", label: "준비물 추가" },
  { key: "settings", label: "설정" },
];

// 준비물 추가 탭에서 항상 고를 수 있는 카테고리
const DEFAULT_CATEGORIES = [
  "의류",
  "세면도구",
  "화장품",
  "전자기기",
  "의약품",
  "신분증",
  "기타",
];

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M2 7.5l3.2 3L12 3.5" />
  </svg>
);

export default function Checklist({
  items,
  setItems,
  setDeletedItems,
}: Props) {
  const [tab, setTab] = useState<Tab>("list");
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    error?: boolean;
  } | null>(null);

  // 카테고리별로 묶기 (처음 나온 순서 유지)
  const groups = items.reduce<Record<string, ChecklistItem[]>>(
    (acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    },
    {}
  );
  const usedCategories = Object.keys(groups);

  const categoryOptions = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...usedCategories])
  );

  const changeTab = (next: Tab) => {
    setTab(next);
    setMessage(null);
  };

  // 체크 / 해제
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // 준비물 추가 (카테고리 선택)
  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      setMessage({ text: "준비물 이름을 입력해주세요.", error: true });
      return;
    }

    if (items.some((i) => i.category === category && i.name === trimmed)) {
      setMessage({
        text: `${category}에 이미 있는 준비물이에요.`,
        error: true,
      });
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: trimmed,
        category,
        checked: false,
        custom: true,
      },
    ]);

    setName("");
    setMessage({ text: `'${trimmed}'을(를) ${category}에 추가했어요.` });
  };

  // 준비물 삭제 (설정 탭)
  const removeItem = (item: ChecklistItem) => {
    if (!window.confirm(`'${item.name}'을(를) 삭제할까요?`)) return;

    setItems((prev) => prev.filter((i) => i.id !== item.id));

    // 기본 준비물은 다시 생성해도 나오지 않도록 기록
    if (!item.custom) {
      setDeletedItems((prev) =>
        prev.includes(item.id) ? prev : [...prev, item.id]
      );
    }
  };

  return (
    <div className="checklist">
      <div className="cl-head">
        <h2>준비물 체크리스트</h2>

        <div className="seg" role="group" aria-label="보기 전환">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => changeTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. 체크리스트: 체크만 가능 */}
      {tab === "list" &&
        (usedCategories.length === 0 ? (
          <p className="note">
            준비물이 없어요. &apos;준비물 추가&apos; 탭에서 추가해보세요.
          </p>
        ) : (
          <div className="cats">
            {usedCategories.map((cat, index) => {
              const list = groups[cat];
              const done = list.filter((i) => i.checked).length;

              return (
                <details className="cat" key={cat} open={index === 0}>
                  <summary>
                    <span>{cat}</span>
                    <em className={done === list.length ? "done" : ""}>
                      {done}/{list.length}
                    </em>
                  </summary>

                  <ul>
                    {list.map((item) => (
                      <li key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                          />
                          <span className="box">
                            <CheckIcon />
                          </span>
                          <span className="t">{item.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        ))}

      {/* 2. 준비물 추가: 카테고리 선택 후 추가 */}
      {tab === "add" && (
        <form className="trip-form" onSubmit={handleAdd}>
          <h2>준비물 추가</h2>

          <div className="field">
            <label htmlFor="add-category">카테고리</label>
            <select
              id="add-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="add-name">준비물 이름</label>
            <input
              id="add-name"
              type="text"
              value={name}
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 우산, 보조배터리"
            />
          </div>

          <button type="submit" className="submit">
            추가하기
          </button>

          {message && (
            <p className={`msg${message.error ? " err" : ""}`} aria-live="polite">
              {message.text}
            </p>
          )}
        </form>
      )}

      {/* 3. 설정: 준비물 삭제 (카테고리별 토글) */}
      {tab === "settings" && (
        <div>
          <p className="note">
            삭제한 기본 준비물은 준비물을 다시 생성해도 나타나지 않아요.
          </p>

          {usedCategories.length === 0 ? (
            <p className="note">삭제할 준비물이 없어요.</p>
          ) : (
            <div className="cats">
              {usedCategories.map((cat, index) => (
                <details className="cat" key={cat} open={index === 0}>
                  <summary>
                    <span>{cat}</span>
                    <em>{groups[cat].length}개</em>
                  </summary>

                  <ul>
                    {groups[cat].map((item) => (
                      <li className="manage-row" key={item.id}>
                        <span className="manage-name">{item.name}</span>
                        {item.custom && <span className="tag">직접 추가</span>}
                        <button
                          type="button"
                          className="del"
                          onClick={() => removeItem(item)}
                          aria-label={`${item.name} 삭제`}
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
