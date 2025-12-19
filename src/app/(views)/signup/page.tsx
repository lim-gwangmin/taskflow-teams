"use client";

import { useSignupForm } from "@/hooks/useSignupForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "@/components/ui/icon";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const {
    register,
    errors,
    isSignupLoading,
    isSendCodeLoading,
    isverifyCodeLoading,
    verifyCodeFlow,
    handleSignupSubmit,
    handleSendCode,
    handleVerifyCode,
  } = useSignupForm();

  console.log(verifyCodeFlow.send, verifyCodeFlow.verify);
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
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              {/* 이름 입력란 */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  <span className="text-xs font-medium text-red-700 align-text-top">*</span>
                  이름
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="이름을 입력하세요"
                    className="pl-10"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              {/* 이메일 입력란 + 인증 버튼 */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  <span className="text-xs font-medium text-red-700 align-text-top">*</span>
                  이메일
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative w-full">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register("email")}
                      id="email"
                      type="text"
                      placeholder="email@example.com"
                      className="w-full pl-10"
                      readOnly={verifyCodeFlow.send && verifyCodeFlow.verify}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendCode}
                    disabled={verifyCodeFlow.send && verifyCodeFlow.verify}
                    isLoading={isSendCodeLoading}
                    className="grow-1 shrink-0 basis-[120px] text-white font-bold py-2 px-4 "
                  >
                    {verifyCodeFlow.send && verifyCodeFlow.verify ? (
                      <CheckIcon size={25} color="green" />
                    ) : (
                      "인증 코드 발송"
                    )}
                  </Button>
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}

                {verifyCodeFlow.send && (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="block text-sm font-semibold text-foreground mb-2">인증번호</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        {...register("verifyCode")}
                        className="w-full"
                        placeholder="인증코드 6자리"
                        readOnly={verifyCodeFlow.send && verifyCodeFlow.verify}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleVerifyCode}
                        isLoading={isverifyCodeLoading}
                        loadingSpinnerColor="#333"
                        disabled={verifyCodeFlow.send && verifyCodeFlow.verify}
                        className="grow-1 shrink-0 basis-[120px] font-bold py-2 px-4"
                      >
                        {verifyCodeFlow.send && verifyCodeFlow.verify ? <CheckIcon size={25} color="green" /> : "인증"}
                      </Button>
                    </div>
                    {errors.verifyCode && <p className="text-xs text-red-500">{errors.verifyCode.message}</p>}
                  </div>
                )}
              </div>

              {/* 비밀번호 입력란 */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                  <span className="text-xs font-medium text-red-700 align-text-top">*</span>
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="숫자, 영어, 특수문자를 반드시 포함"
                    className="pl-10"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* 비밀번호 확인란 */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-foreground mb-2">
                  <span className="text-xs font-medium text-red-700 align-text-top">*</span>
                  비밀번호 확인
                </label>
                <div className="relative w-full">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("confirmPassword")}
                    id="confirm-password"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    className="pl-10"
                  />
                </div>

                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {/* 회원가입 버튼 */}
              <Button type="submit" isLoading={isSignupLoading} className="w-full">
                회원가입 <ArrowRight />
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?
                <a className="pl-2 text-primary hover:text-primary/80 font-semibold" href="/login">
                  로그인
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
