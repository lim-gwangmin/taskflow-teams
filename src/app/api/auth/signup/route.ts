// src/app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { COMMON_COMMENTS, AUTH_COMMENTS } from "@/constants/comments";

export function generateFriendlyNickname() {
  const adjectives = [
    "용감한",
    "조용한",
    "날쌘",
    "친절한",
    "행복한",
    "파란색",
    "빛나는",
    "튼튼한",
    "잠자는",
    "배고픈",
    "슬기로운",
    "단단한",
  ];
  const nouns = [
    "호랑이",
    "거북이",
    "개복치",
    "다람쥐",
    "고양이",
    "돌고래",
    "사자",
    "코끼리",
    "판다",
    "여우",
    "참새",
    "고래",
  ];
  const adjIndex = Math.floor(Math.random() * adjectives.length);
  const nounIndex = Math.floor(Math.random() * nouns.length);

  const nickname = `${adjectives[adjIndex]}${nouns[nounIndex]}`;

  return nickname;
}

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

    let nickname;
    let discriminator;
    let isUnique = false;

    while (!isUnique) {
      nickname = generateFriendlyNickname();
      discriminator = String(Math.floor(Math.random() * 9000) + 1000);

      console.log(`시도: ${nickname}#${discriminator}`);

      const existingUser = await prisma.user.findUnique({
        where: {
          nickname_discriminator: {
            nickname,
            discriminator,
          },
        },
      });

      if (!existingUser) {
        isUnique = true;
        console.log(`성공: ${nickname}#${discriminator}`);
      }
    }

    if (!nickname || !discriminator) {
      throw new Error("유저 해시코드를 생성하는 도중 예기치 못한 에러가 발생했습니다.");
    }

    // 3. 비밀번호 해싱 (암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 새로운 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        nickname,
        discriminator,
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
