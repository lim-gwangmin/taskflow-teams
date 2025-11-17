// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma 클라이언트 인스턴스
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { COMMON_COMMENTS, AUTH_COMMENTS } from "@/constants/comments";

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  path: string;
  maxAge?: number;
}

export async function POST(request: NextRequest) {
  const { SUCCESS_200, ERROR_401, ERROR_404, ERROR_500 } = AUTH_COMMENTS.LOGIN;
  const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;

  try {
    const { email, password, rememberMe } = await request.json();

    // 1. 이메일로 사용자 찾기
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_404 },
        },
        { status: 404 }
      );
    }

    // 2. 비밀번호 비교 (bcrypt 사용)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_401 },
        },
        { status: 401 }
      );
    }

    // 3. JWT 토큰 생성
    const token = jwt.sign({ userSeq: user.seq }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const { seq, name, email: userEmail, nickname, discriminator } = user;
    // 4. 성공 응답과 함께 쿠키에 토큰 저장
    const response = NextResponse.json(
      {
        success: true,
        data: {
          message: SUCCESS_200,
          user: {
            seq,
            name,
            email: userEmail,
            nickname,
            discriminator,
          },
        },
        error: null,
      },
      { status: 200 }
    );

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as "strict",
      path: "/",
    };

    if (rememberMe) {
      // '자동 로그인' 체크 시: 7일간 유효한 쿠키
      cookieOptions.maxAge = 60 * 60 * 24 * 7;
    }
    // 체크하지 않은 경우: maxAge를 설정하지 않아 '세션 쿠키'가 됨
    response.cookies.set("token", token, cookieOptions);

    return response;
  } catch (error) {
    console.error(SERVER_ERROR, ERROR_500, error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: ERROR_500 },
      },
      { status: 500 }
    );
  }
}
