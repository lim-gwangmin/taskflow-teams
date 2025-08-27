'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
    
 const router = useRouter();

  const handleLogout = async () => {
    // 로그아웃 API 호출
    const response = await fetch('/api/logout');

    if (response.ok) {
      // 로그아웃 성공 시 로그인 페이지로 이동
      router.push('/login');
    } else {
      alert('로그아웃에 실패했습니다.');
    }
  };
    return (
        <main>
            <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            <button onClick={handleLogout}>로그아웃</button>
        </main>
    )
}