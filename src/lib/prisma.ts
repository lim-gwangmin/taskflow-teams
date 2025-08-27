import { PrismaClient } from '@prisma/client';

// TypeScript의 global 객체에 prisma 속성을 추가하기 위한 선언
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// PrismaClient 인스턴스를 생성하거나, 이미 생성된 인스턴스가 있다면 재사용합니다.
// 개발 환경에서 파일이 변경될 때마다 코드가 재실행되어 PrismaClient가 계속 새로 생성되는 것을 방지합니다.
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}