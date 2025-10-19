import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COMMON_COMMENTS, AUTH_COMMENTS } from "@/constants/comments";

export async function POST(request: NextRequest) {
  const { SUCCESS_200, ERROR_400_INVALID_CODE, ERROR_400_CODE_EXPIRED, ERROR_500 } = AUTH_COMMENTS.VERIFY_CODE;
  const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;
  try {
    const { email, code } = await request.json();

    const verification = await prisma.verificationToken.findUnique({ where: { email } });

    // 1. 사용자가 없거나 코드가 일치하지 않는 경우
    if (!verification || verification.verificationCode !== code) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_400_INVALID_CODE },
        },
        { status: 400 }
      );
    }

    // 2. 인증 코드가 만료된 경우
    if (new Date() > verification.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_400_CODE_EXPIRED },
        },
        { status: 400 }
      );
    }

    // 3. 인증 성공 시, 인증 코드 관련 필드 초기화 (선택 사항이지만 권장)
    await prisma.verificationToken.delete({
      where: { email },
    });

    return NextResponse.json(
      {
        success: true,
        data: { message: SUCCESS_200 },
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
