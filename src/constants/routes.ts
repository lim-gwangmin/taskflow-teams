import { redirect } from "next/navigation";
import { DropDownMenu } from "@/components/dropdown/types";
import { get_logout } from "@/services/auth";

// 페이지 라우트
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
} as const;
