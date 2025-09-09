import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    console.log(email, code,'email, code')

    const verification = await prisma.verificationToken.findUnique({ where: { email } });

    // 1. 사용자가 없거나 코드가 일치하지 않는 경우
    if (!verification || verification.verificationCode !== code) {
      return NextResponse.json({ error: '인증번호가 올바르지 않습니다.' }, { status: 400 });
    }

    // 2. 인증 코드가 만료된 경우
    if (new Date() > verification.expiresAt) {
      return NextResponse.json({ error: '인증번호가 만료되었습니다.' }, { status: 400 });
    }

    // 3. 인증 성공 시, 인증 코드 관련 필드 초기화 (선택 사항이지만 권장)
    await prisma.verificationToken.delete({
      where: { email }
    });
    
    return NextResponse.json({ message: '이메일 인증이 완료되었습니다.' }, { status: 200 });

  } catch (error) {
    console.error('인증 확인 오류:', error);
    return NextResponse.json({ error: '인증 확인 중 오류가 발생했습니다.' }, { status: 500 });
  }
}