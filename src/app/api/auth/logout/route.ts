import { NextResponse } from "next/server";
import { COMMON_COMMENTS, AUTH_COMMENTS } from "@/constants/comments";

const { SUCCESS_200, ERROR_500 } = AUTH_COMMENTS.LOGOUT;
const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;

export async function GET() {
  try {
    // 1. 성공 메시지를 담은 응답 객체 생성
    const response = NextResponse.json(
      {
        success: true,
        data: { message: SUCCESS_200 },
        error: null,
      },
      { status: 200 }
    );

    // 2. 기존의 'token' 쿠키를 삭제하도록 설정
    response.cookies.delete("token");

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
