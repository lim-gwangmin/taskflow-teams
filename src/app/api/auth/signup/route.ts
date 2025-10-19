// src/app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { COMMON_COMMENTS, AUTH_COMMENTS } from "@/constants/comments";

export async function POST(request: NextRequest) {
  const { SUCCESS_200, ERROR_400, ERROR_409, ERROR_500 } = AUTH_COMMENTS.SIGNUP;
  const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;
  try {
    const { email, password, name } = await request.json();

    // 1. 입력 값 검증
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_400 },
        },
        { status: 400 }
      );
    }

    // 2. 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_409 },
        },
        { status: 409 }
      );
    }

    // 3. 비밀번호 해싱 (암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 새로운 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 보안을 위해 password 필드를 응답에서 제외
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        data: { message: SUCCESS_200, user: userWithoutPassword },
        error: null,
      },
      { status: 200 }
    );
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
