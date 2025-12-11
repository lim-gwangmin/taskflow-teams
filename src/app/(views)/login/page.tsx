"use client";
import useLoginForm from "@/hooks/useLoginForm";
import { LoadingSpinner } from "@/components/ui/icon";

export default function LoginPage() {
  const { isLoading, register, handleSubmit, errors } = useLoginForm();

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
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2 border placeholder:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* 비밀번호 입력란 */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-2 border placeholder:text-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* 자동 로그인 체크란 */}
            <div className="flex items-center">
              <div className="relative flex items-center justify-center w-5 h-5">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="
                      peer appearance-none w-full h-full border border-gray-300 rounded-md
                      checked:bg-blue-600 checked:border-transparent
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      cursor-pointer
                    "
                />
                {/* SVG 체크 아이콘 */}
                <div className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg
                    className="w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
              <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                자동 로그인
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="relative h-[48px] w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner
                  width={30}
                  height={30}
                  style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                />
              ) : (
                "로그인"
              )}
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
