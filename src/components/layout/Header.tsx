"use client";

import Link from "next/link";
import { DROPDOWN_ROUTES } from "@/constants/routes";
import { ROUTES } from "@/constants/routes";
import { Button } from "../ui/button";
import { Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AUTH_API_URLS } from "@/constants/api/auth";
import useCustomRouter from "@/hooks/useCustomRouter";
import { GET } from "@/lib/axiosInstans";
import { useUserStore } from "@/store/userStore";
import { SuccessResponse } from "@/types/response_type";
import NotificationPopover from "../ui/notification-popover";

type UserSchemaProp = {
  onMenuClick: () => void;
  // currentUser: {
  //   seq: number;
  //   name: string;
  //   email: string;
  //   nickname: string;
  //   discriminator: string;
  // };
};

export default function Header({ onMenuClick }: UserSchemaProp) {
  const { currentUser, logout } = useUserStore();
  const { handleRoute } = useCustomRouter();

  const handleLogout = async (): Promise<void> => {
    // 로그아웃 API 호출
    try {
      const response = await GET<SuccessResponse>(AUTH_API_URLS.LOG_OUT);
      const { data, error } = response;

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
      logout();
      handleRoute(ROUTES.LOGIN);
    } catch (error) {
      console.error("logout error: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu />
        </Button>
        <div className="flex items-center gap-4 ml-auto">
          <NotificationPopover />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://avatar.vercel.sh/user" />
                  <AvatarFallback>사용자</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  프로필
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/settings">
                <DropdownMenuItem>설정</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
