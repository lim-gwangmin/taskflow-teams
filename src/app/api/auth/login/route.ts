// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Prisma 클라이언트 인스턴스
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?:number;
}


export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    // 1. 이메일로 사용자 찾기
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 2. 비밀번호 비교 (bcrypt 사용)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // 3. JWT 토큰 생성
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    // 4. 성공 응답과 함께 쿠키에 토큰 저장
    const response = NextResponse.json({ message: '로그인 성공' }, { status: 200 });

    const cookieOptions : CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as 'strict',
        path: '/',
    };

    if (rememberMe) {
        // '자동 로그인' 체크 시: 7일간 유효한 쿠키
        cookieOptions.maxAge = 60 * 60 * 24 * 7;
      }
      // 체크하지 않은 경우: maxAge를 설정하지 않아 '세션 쿠키'가 됨
      
      response.cookies.set('token', token, cookieOptions);


    return response;

  } catch (error) {
    console.error('로그인 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}