// "use client";

// import React, { useState } from 'react';

// type MainLayoutProps = {
//   children: React.ReactNode;
// };

// export default function MainLayout({ children }: MainLayoutProps) {
//   // 사이드바의 열림/닫힘 상태를 관리. 데스크톱에서는 기본적으로 열린 상태로 시작.
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // 사이드바 상태를 토글하는 함수 (열고 닫는 역할)
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
    
//   );
// }
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma'; // Prisma 클라이언트 (예시)
import Header from '@/components/layout/Header';
import {Button, ButtonGroup} from "@heroui/button";

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export default async function DashboardPage() {
  // 1. 쿠키에서 토큰 가져오기
    const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');

  if (!tokenCookie) {
    // 토큰이 없으면 로그인 페이지로 리디렉션
    redirect('/login');
  }

  try {

     const secret = process.env.JWT_SECRET!;
    const decoded = verify(tokenCookie.value, secret);

    // 타입 가드로 안전하게 userId 추출
    if (typeof decoded === 'object' && 'userId' in decoded) {
        const userId = decoded.userId as string; // userId의 타입까지 명확히 해줄 수 있음

        const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        });

        if (!currentUser) {
        redirect('/login');
        }
        
        return (
            <>
                <Header/>
                <div>
                    <h1>Welcome, {currentUser.name}!</h1>
                    <p>Your email: {currentUser.email}</p>
                    <Button color="primary" id='button'>로그아웃</Button>
                </div>
            </>

        );

    } else {
        // 유효하지 않은 페이로드 처리
        throw new Error('Invalid token structure');
    }

    // // 2. 토큰 검증 및 payload에서 userId 추출
    // const secret = process.env.JWT_SECRET;
    // const decoded = verify(tokenCookie.value, secret) as TokenPayload;
    // const userId = decoded.userId;

    // // 3. 추출한 userId로 데이터베이스에서 사용자 정보 조회!
    // const currentUser = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    // // if (!currentUser) {
    // //   // 해당 ID의 사용자가 DB에 없으면 로그인 페이지로
    // //   redirect('/login');
    // // }

    // // 4. 조회한 사용자 정보로 페이지 렌더링
    // return (
    //   <div>
    //     <h1>Welcome, {currentUser.name}!</h1>
    //     <p>Your email: {currentUser.email}</p>
    //   </div>
    // );
  } catch (error) {
    // 토큰이 유효하지 않은 경우 (만료, 변조 등)
    console.error('Invalid token:', error);
    redirect('/login');
  }
}