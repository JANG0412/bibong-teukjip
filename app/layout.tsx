import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "비봉 특집",
  description: "지인들과의 모임 기록 보관 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-gradient-to-b from-rose-50 via-amber-50 to-sky-50 text-zinc-900">
          <header className="sticky top-0 z-10 border-b border-white/60 bg-white/60 backdrop-blur">
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
              <a href="/" className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tracking-tight">
                  비봉 특집
                </span>
                <span className="text-sm text-zinc-600">모임 기록</span>
              </a>
            </div>
          </header>
          <main className="mx-auto w-full max-w-3xl px-4 py-6">
            {children}
          </main>
          <footer className="mx-auto w-full max-w-3xl px-4 pb-10 text-sm text-zinc-500">
            <div className="rounded-2xl bg-white/50 p-4">
              <div className="font-medium text-zinc-700">비봉 특집</div>
              <div>따뜻한 기록이 쌓이는 공간</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
