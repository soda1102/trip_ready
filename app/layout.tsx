import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jamsil = localFont({
  src: [
    {
      path: "./fonts/The_Jamsil_3_Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/The_Jamsil_5_Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-jamsil",
});

export const metadata: Metadata = {
  title: "트레디 TRIP READY",
  description: "여행 전 준비물을 한눈에 확인하는 체크리스트",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={jamsil.variable} suppressHydrationWarning>
      <head>
        {/* 저장된 테마를 화면이 그려지기 전에 적용 (깜빡임 방지) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("trip-ready-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
