// 페이지 라우트
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  GROUP: "/group",
  PROFILE: "/profile",
} as const;

// 드롭다운 메뉴 및 라우트
export const DROPDOWN_ROUTES = [
  { menu: "대시보드", url: ROUTES.DASHBOARD },
  { menu: "그룹관리", url: ROUTES.GROUP },
  { menu: "마이페이지", url: ROUTES.PROFILE },
] as const;
