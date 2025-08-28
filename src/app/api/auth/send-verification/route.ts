// src/app/api/auth/send-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // 1. 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
    }

    // 2. 이메일 인증 전송 유무 확인
    const hasVerificationToken = await prisma.user.findUnique({ where: { email } });

    /**
     * 1.전송 유무 확인
     * 2.인증만료 확인 
     * 인증 만료시 : 데이터 제거 
     * 인증 유효 시 : '이미 인증코드 전송되었습니다' 알림과 동시 리턴 
     * 그 외 : '인증코드가 전송되었습니다' 알림과 동시에 데이터 추가 및 리턴 
     */

    // 이미 인증 코드가 전송됐을 시,
    if (hasVerificationToken) {

       const existingToken = await prisma.verificationToken.findUnique({
          where: { email },
        });
        const hasExpired = new Date() > existingToken.expiresAt;

        // 인증 코드가 유효할 시,
        if(!hasExpired) return NextResponse.json({ error: "이미 인증코드가 전송되었습니다." }, { status: 409 });

        // 인증 코드가 만료되었을 시 데이터 삭제
        await prisma.verificationToken.deleteMany({
            where: { email }
        });        

        NextResponse.json({ error: "인증코드가 만료되었습니다. 다시 시도해주세요." }, { status: 409 });
    };

    // 3. 6자리 인증 코드 생성
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료

    // 3. DB에 인증 코드와 만료 시간 임시 저장 (update가 아닌 upsert 사용)

    await prisma.verificationToken.create({
      data: {
        email,
        verificationCode,
        expiresAt,
      },
    });

    // await prisma.user.upsert({
    //   where: { email },
    //   update: {
    //     verificationCode,
    //     verificationCodeExpiresAt: expiresAt,
    //   },
    //   create: {
    //     email,
    //     password: '', // 임시 필드, 실제 회원가입 시 채워짐
    //     verificationCode,
    //     verificationCodeExpiresAt: expiresAt,
    //   },
    // });
    
    // 4. Nodemailer 설정 및 이메일 발송
    const transporter = nodemailer.createTransport({
      service: 'gmail', // 또는 다른 SMTP 서비스
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail 앱 비밀번호 사용
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'TaskFlow Teams 이메일 인증 코드 🥳',
      html: `<h1>인증 코드:</h1><h2>${verificationCode}</h2>`,
    });

    return NextResponse.json({ message: '인증 코드가 이메일로 전송되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error('이메일 전송 오류:', error);
    return NextResponse.json({ error: '이메일 전송 중 오류가 발생했습니다.' }, { status: 500 });
  }
}