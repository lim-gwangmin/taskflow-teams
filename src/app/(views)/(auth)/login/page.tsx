"use client";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { isLoading, register, handleSubmit, errors } = useLoginForm();

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">TaskFlow Teams</h1>
        <p className="text-gray-500 mt-2">서비스를 이용하려면 로그인하세요.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* 이메일 입력란 */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
            이메일
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="text"
              placeholder="email@example.com"
              className="w-full pl-10 "
              {...register("email")}
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* 비밀번호 입력란 */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
            비밀번호
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full pl-10"
              {...register("password")}
              disabled={isLoading}
            />
          </div>

          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* 자동 로그인 체크란 */}
        <div className="flex items-center">
          <div className="relative flex items-center justify-center w-4 h-4">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="
                      peer appearance-none w-full h-full border border-gray-300 
                      checked:bg-primary checked:border-transparent
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
                strokeWidth="3"
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
        <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
          로그인
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          계정이 없으신가요?
          <a className="pl-2 text-primary hover:text-primary/80 font-semibold" href="/signup">
            회원가입
          </a>
        </p>
      </div>
    </>
  );
}
