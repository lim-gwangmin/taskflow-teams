"use client";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    // 1. 전체 화면을 차지하고, 배경색을 연한 회색으로 설정
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* 2. 로그인 폼 컨테이너 */}
      <div className="w-full max-w-md">
        {/* 3. 흰색 배경의 네모 박스 (Card) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">{children}</div>
      </div>
    </main>
  );
}
