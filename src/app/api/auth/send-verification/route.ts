// src/app/api/auth/send-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { AUTH_COMMENTS, COMMON_COMMENTS } from "@/constants/comments";

const { SUCCESS_200, ERROR_409_EMAIL_ALREADY_EXISTS, ERROR_409_CODE_ALREADY_SENT, ERROR_500 } =
  AUTH_COMMENTS.SEND_VERIFICATION;
const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    // 1. 이미 '가입 완료된' 사용자인지 확인 (User 테이블)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_409_EMAIL_ALREADY_EXISTS },
        },
        { status: 409 }
      );
    }

    // 2. 기존에 만료되지 않은 인증 요청이 있는지 확인 (verificationToken 테이블)
    const existingToken = await prisma.verificationToken.findUnique({ where: { email } });
    if (existingToken && new Date() < existingToken.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_409_CODE_ALREADY_SENT },
        },
        { status: 409 }
      );
    }

    // 3. 새로운 인증 코드 생성 및 DB에 저장/업데이트 (upsert 사용)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료

    // 4. 이메일 발송 로직 (동일)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "TaskFlow Teams 이메일 인증 코드 🥳",
      html: `<h1>인증 코드:</h1><h2>${verificationCode}</h2>`,
    });

    // 메일 발송 성공 시 디비 저장
    await prisma.verificationToken.upsert({
      where: { email },
      update: { verificationCode, expiresAt },
      create: { email, verificationCode, expiresAt },
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
