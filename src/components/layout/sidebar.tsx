"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Home, Bell, Settings, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [expandedTeams, setExpandedTeams] = useState(false);

  const teams = [
    { id: 1, name: "리액트 스터디", role: "Admin" },
    { id: 2, name: "UI/UX 디자인", role: "Manager" },
    { id: 3, name: "마케팅팀", role: "Viewer" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Manager":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-99" onClick={() => setIsOpen(false)} />}

      {/* 사이드바 */}
      <aside
        className={`fixed lg:relative w-64 h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-99 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 로고 */}
        <div className="p-4.5 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground">TaskFlow</h1>
          </Link>
        </div>

        {/* 메인 네비게이션 */}
        <nav className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Home className="mr-2 h-4 w-4" />
                대시보드
              </Button>
            </Link>
            <Link href="/discover/groups">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Search className="mr-2 h-4 w-4" />
                그룹 찾기
              </Button>
            </Link>
            <Link href="/invitations">
              <Button variant="ghost" className="w-full justify-start relative" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                초대 & 요청
                <span className="absolute right-2 px-2 py-0.5 text-xs font-bold bg-accent text-accent-foreground rounded-full">
                  3
                </span>
              </Button>
            </Link>
          </div>

          {/* 내 그룹 */}
          <div className="mt-6">
            <button
              onClick={() => setExpandedTeams(!expandedTeams)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm font-semibold"
            >
              <span>내 그룹</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedTeams ? "rotate-180" : ""}`} />
            </button>

            {expandedTeams && (
              <div className="mt-2 space-y-1 pl-4">
                {teams.map((team) => (
                  <Link key={team.id} href={`/groups/${team.id}`}>
                    <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                      <div className="flex-1 text-left truncate">{team.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${getRoleColor(team.role)}`}>
                        {team.role}
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/groups/new" className="mt-2 block">
              <Button variant="ghost" className="w-full justify-start text-sidebar-primary" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                그룹 만들기
              </Button>
            </Link>
          </div>
        </nav>

        {/* 하단 */}
        <div className="p-4 border-t border-sidebar-border">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
