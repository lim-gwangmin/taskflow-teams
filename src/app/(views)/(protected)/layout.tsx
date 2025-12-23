"use client";

import { useState, ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 overflow-auto">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div>{children}</div>
      </main>
    </div>
  );
}
