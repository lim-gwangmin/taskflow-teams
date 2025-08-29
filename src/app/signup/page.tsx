"use client";

import { useState, useRef, FormEvent } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useLoader from '@/hooks/useLoader';

export default function SignupPage() {
  const formRef = useRef(null);
  const modalFormRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useLoader(false);
  const [ hasVerification, setHasVerification ] = useState<boolean>(false);
  const router = useRouter();

  // 이메일 인증코드 전송
  const sendVerification = async () : Promise<void> =>  {
    const email = formRef.current?.elements['email']?.value;
    
    setIsLoading(true);

    try {
      // 1. fetch를 사용해 REST API 호출
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('인증코드가 메일로 전송되었습니다.');
        setIsModalOpen(true);
      } else {
        toast.error(data.error || '인증코드 발송에 실패했습니다.');
      }
    } catch (error) {
      toast.error('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Signup failed:', error);
    } finally {
        setIsLoading(false);
    };

  };

  // 이메일 코드 인증 
  const verifyCode = async (e: FormEvent<HTMLFormElement>) : Promise<void> => {
    e.preventDefault();

    const email = (formRef.current?.elements['email'] as HTMLInputElement)?.value;
    const code = (modalFormRef.current?.elements['verifyCode'] as HTMLInputElement)?.value;
    
    setIsLoading(true);

    try {
      // 1. fetch를 사용해 REST API 호출
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('인증되었습니다.');
        setHasVerification(true);
        setIsModalOpen(false);
      } else {
        toast.error(data.error || '인증에 실패했습니다.');
      }
    } catch (error) {
      toast.error('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Signup failed:', error);
    } finally {
        setIsLoading(false);
    };
  }

  // 비밀번호 정책 유효성 검사 함수
    function validatePassword(password : string) : boolean {
        // 1. 비밀번호 길이 확인 (6자리 이상)
        if (password.length < 6) {
            toast.error("비밀번호는 6자리 이상이어야 합니다.");
            return false;
        }

        // 2. 숫자 포함 여부 확인
        // \d 는 숫자를 의미하는 정규식입니다.
        const hasNumber = /\d/.test(password);
        if (!hasNumber) {
            toast.error("비밀번호에 숫자가 포함되어야 합니다.");
            return false;
        }

        // 3. 특수문자 포함 여부 확인
        // 아래 정규식은 일반적인 특수문자들을 포함합니다.
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasSpecialChar) {
            toast.error("비밀번호에 특수문자가 포함되어야 합니다.");
            return false;
        }

        return true;
    }

  // 회원가입 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) : Promise<void> => {
    e.preventDefault();

    // FormData를 사용해 form에서 직접 값을 가져옵니다.
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    // 비밀번호 정책 유효성 검사
    if(!validatePassword(password)) return;

    // 비밀번호, 비밀번호 확인 일치한지 확인
    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. fetch를 사용해 REST API 호출
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
        router.push('/login');
      } else {
        toast.error(data.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      toast.error('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {/* 1. 회원가입 페이지 메인 UI */}
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
              <p className="text-gray-500 mt-2">새로운 계정을 생성하세요.</p>
            </div>
            <form className="space-y-6" ref={formRef} onSubmit={handleSubmit}>
            {/* 이름 입력란 */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* 이메일 입력란 + 인증 버튼 */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  이메일
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 read-only:cursor-not-allowed"
                    required
                    readOnly={hasVerification}
                  />
                  <button
                    type="button"
                    onClick={sendVerification}
                    disabled={hasVerification}
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    인증
                  </button>
                </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs font-medium text-red-700">숫자와 특수문자를 반드시 포함 6자리 이상</p>
              </div>

              {/* 비밀번호 확인란 */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                회원가입
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 2. 인증번호 입력 모달창 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">인증번호 입력</h2>
            <p className="text-sm text-gray-600 mb-4">
              이메일로 전송된 6자리 인증번호를 입력해주세요.
            </p>
            <form ref={modalFormRef} onSubmit={verifyCode}>
              <input
                type="text"
                name="verifyCode"
                maxLength={6}
                placeholder="123456"
                className="w-full px-4 py-3 text-center tracking-[0.5em] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  인증하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}