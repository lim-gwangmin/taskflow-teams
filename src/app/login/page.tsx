"use client";

import { useState, FormEvent } from 'react';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                router.push('/dashboard'); // 로그인 성공 시 대시보드 페이지로 이동
            } else {
                const data = await response.json();
                toast.error(data.error);

            //   setError(data.error || '로그인에 실패했습니다.');
            }
        } catch(error) {
            console.error(error);

        } finally {
            setIsLoading(false);
        }
    };

  return (
    // 1. 전체 화면을 차지하고, 배경색을 연한 회색으로 설정
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* 2. 로그인 폼 컨테이너 */}
      <div className="w-full max-w-md">
        
        {/* 3. 흰색 배경의 네모 박스 (Card) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">TaskFlow Teams</h1>
            <p className="text-gray-500 mt-2">서비스를 이용하려면 로그인하세요.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 이메일 입력란 */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2 border placeholder:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 비밀번호 입력란 */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-2 border placeholder:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              로그인
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="text-center mt-6">
            <a href="/signup" className="text-sm text-gray-500 hover:text-gray-700">
              계정이 없으신가요? <span className="font-semibold text-blue-600">회원가입</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}