// 인증 관련 API url
export const AUTH_API_URLS = {
  LOG_IN: "/api/auth/login", // 로그인
  LOG_OUT: "/api/auth/logout", // 로그아웃
  SIGN_UP: "/api/auth/signup", // 회원가입
  VERIFY_CODE: "/api/auth/verify-code", // 인증코드 인증
  SEND_VERIFICATION: "/api/auth/send-verification", // 이메일 인증코드 전송
} as const;
