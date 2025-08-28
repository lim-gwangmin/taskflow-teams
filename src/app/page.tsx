"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => router.push('/login'), []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">TaskFlow Teams</h1>
        <p className="text-muted-foreground">로그인 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
