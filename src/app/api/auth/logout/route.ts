import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. 성공 메시지를 담은 응답 객체 생성
    const response = NextResponse.json(
      { success: true, message: '로그아웃 성공' },
      { status: 200 }
    );

    // 2. 기존의 'token' 쿠키를 삭제하도록 설정
    response.cookies.delete('token');

    return response;

  } catch (error) {
    console.error('로그아웃 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}