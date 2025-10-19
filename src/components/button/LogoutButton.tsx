"use client";

import useCustomRouter from "@/hooks/useCustomRouter";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { AUTH_API_URLS } from "@/constants/api/auth";

export default function LogoutButton() {
  const { handleRoute } = useCustomRouter();

  const handleLogout = async (): Promise<void> => {
    // 로그아웃 API 호출
    const response = await fetch(AUTH_API_URLS.LOG_OUT);

    if (response.ok) {
      // 로그아웃 성공 시 로그인 페이지로 이동
      handleRoute(ROUTES.LOGIN);
    } else {
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <Button type="button" variant="light" onPress={handleLogout}>
      로그아웃
    </Button>
  );
}
