import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ROUTES } from '@/constants/routes';


// 1. ROUTES 상수를 사용하여 공개 페이지 배열 생성
const publicPages = [ROUTES.LOGIN, ROUTES.SIGNUP] as const;

// 2. publicPages 배열로부터 타입을 추론
type PublicPage = typeof publicPages[number];

// 3. 타입 가드 함수 (동일)
function isPublicPage(path: string): path is PublicPage { 
  return (publicPages as readonly string[]).includes(path);
}

// 미들웨어가 실행될 경로를 지정합니다.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

// JWT 서명에 사용된 비밀 키를 가져옵니다.
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  let isTokenValid = false;
  if (token) {
    try {
      // 토큰 유효성 검증
      await jwtVerify(token, secret);
      isTokenValid = true;
    } catch (err) {
      // 토큰이 유효하지 않은 경우 (만료, 변조 등)
      console.error('Invalid token:', err);
      isTokenValid = false;
    }
  }

  // 1. 토큰이 유효한 경우
  if (isTokenValid) {
    // 로그인/회원가입 페이지에 접근하려고 하면 대시보드로 리디렉션
    if (isPublicPage(pathname)) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  } 
  // 2. 토큰이 유효하지 않은 경우
  else {
    // 보호된 페이지에 접근하려고 하면 로그인 페이지로 리디렉션
    if (!isPublicPage(pathname)) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    }
  }

  // 그 외 모든 경우는 요청을 그대로 통과
  return NextResponse.next();
}