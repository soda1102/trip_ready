"use client";

const STORAGE_KEY = "trip-ready-theme";

export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;

    // 직접 고른 테마가 없으면 기기 설정을 기준으로 판단
    const current =
      root.dataset.theme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* 저장 실패 시 무시 */
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="라이트·다크 모드 전환"
      title="라이트·다크 모드 전환"
    >
      {/* 다크 모드일 때 보이는 해 아이콘 (누르면 라이트로) */}
      <svg className="sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* 라이트 모드일 때 보이는 달 아이콘 (누르면 다크로) */}
      <svg className="moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
