import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { AUTH_API_URLS } from "@/constants/api/auth";
import { AUTH_COMMENTS } from "@/constants/comments";
import { POST } from "@/lib/axiosInstans";
import { SuccessResponse } from "@/types/response_type";

// 문자열 상수
const { SIGN_UP, VERIFY_CODE, SEND_VERIFICATION } = AUTH_API_URLS;
const {
  VALIDATE_LENGTH,
  VALIDATE_HAS_NAME,
  VALIDATE_HAS_NUMBER,
  VALIDATE_HAS_SPECIALCHAR,
  VALIDATE_HAS_LOWERCASE,
  VALIDATE_CONFIRM_PASSWORD,
  VALIDATE_HAS_UPPERCASE,
  VALIDATE_EMAIL,
  VALIDATE_VERIFICATION,
} = AUTH_COMMENTS.SIGNUP;
const { VALIDATE_EMAIL_CODE, VALIDATE_EMAIL_CODE_ALERT } = AUTH_COMMENTS.VERIFY_CODE;

const signupSchema = z
  .object({
    name: z.string().min(1, VALIDATE_HAS_NAME),
    email: z.email(VALIDATE_EMAIL),
    // verifyCode: z.boolean().parse(true),
    verifyCode: z.string().min(6, VALIDATE_EMAIL_CODE_ALERT).max(6),
    password: z
      .string()
      .min(6, VALIDATE_LENGTH)
      .regex(/[A-Z]/, VALIDATE_HAS_UPPERCASE)
      .regex(/[a-z]/, VALIDATE_HAS_LOWERCASE)
      .regex(/[0-9]/, VALIDATE_HAS_NUMBER)
      .regex(/[^A-Za-z0-9]/, VALIDATE_HAS_SPECIALCHAR),
    confirmPassword: z.string().min(1, VALIDATE_CONFIRM_PASSWORD),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: VALIDATE_CONFIRM_PASSWORD,
  });

const sendCodeSchema = z.object({
  email: z.email(VALIDATE_EMAIL),
});
const verifyCodeSchema = z.object({
  email: z.email(VALIDATE_EMAIL),
  verifyCode: z.string(VALIDATE_EMAIL_CODE).min(6, VALIDATE_EMAIL_CODE_ALERT),
});

type SignupInputs = z.infer<typeof signupSchema>;
type SendCodeInputs = z.infer<typeof sendCodeSchema>;
type VerifyCodeInputs = z.infer<typeof verifyCodeSchema>;

export function useSignupForm() {
  const router = useRouter();
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isSendCodeLoading, setIsSendCodeLoading] = useState(false);
  const [isverifyCodeLoading, setIsverifyCodeLoading] = useState(false);
  const [verifyCodeFlow, setverifyCodeFlow] = useState({ verify: false, send: false });

  // 회원가입 폼 설정
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      verifyCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  //
  const {
    trigger,
    getValues,
    register,
    formState: { errors },
    handleSubmit,
  } = signupForm;

  // 1. 이메일 인증 코드 발송 전용 함수
  const handleSendCode = async () => {
    const emailValue = getValues("email");
    // 이메일 필드만 유효성 검사 실행
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;

    setIsSendCodeLoading(true);
    try {
      const response = await POST<SuccessResponse>(SEND_VERIFICATION, { email: emailValue });
      const { success, data, error } = response;

      setverifyCodeFlow((prev) => ({ ...prev, send: true }));

      if (!success) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendCodeLoading(false);
    }
  };

  // 2. 인증 코드 검증 전용 함수
  const handleVerifyCode = async () => {
    const { email, verifyCode } = getValues();
    // 인증코드 필드만 유효성 검사 실행
    const isCodeValid = await trigger("verifyCode");
    if (!isCodeValid) return;

    setIsverifyCodeLoading(true);

    try {
      const response = await POST<SuccessResponse>(VERIFY_CODE, { email, code: verifyCode });
      const { success, data, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
      setverifyCodeFlow((prev) => ({ ...prev, verify: true }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsverifyCodeLoading(false);
    }
  };
  // 회원가입 폼 이벤트
  const onSignupSubmit = async (signupData: SignupInputs) => {
    setIsSignupLoading(true);

    try {
      if (!verifyCodeFlow.verify) {
        toast.error("이메일 인증을 완료해주세요.");
        throw new Error("이메일 인증 오류");
      }

      const response = await POST<SuccessResponse>(SIGN_UP, signupData);
      const { success, data, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsSignupLoading(false);
    }
  };

  return {
    register,
    errors,
    isSignupLoading,
    isSendCodeLoading,
    isverifyCodeLoading,
    verifyCodeFlow,
    handleSignupSubmit: handleSubmit(onSignupSubmit),
    handleSendCode, // 수정된 함수
    handleVerifyCode, // 수정된 함수
  };
  //

  // // 이메일 인증 코드 발송 폼 설정
  // const sendCodeForm = useForm({
  //   resolver: zodResolver(sendCodeSchema),
  //   mode: "onSubmit",
  //   reValidateMode: "onSubmit",
  //   shouldFocusError: true,
  //   defaultValues: {
  //     email: "",
  //   },
  // });

  // // 이메일 인증코드 인증 폼 설정
  // const verifyCodeForm = useForm({
  //   resolver: zodResolver(verifyCodeSchema),
  //   mode: "onSubmit",
  //   reValidateMode: "onSubmit",
  //   shouldFocusError: true,
  //   defaultValues: {
  //     email: "",
  //     verifyCode: "",
  //   },
  // });
  // // 회원가입 폼 이벤트
  // const onSignupSubmit = async (signupData: SignupInputs) => {
  //   setIsSignupLoading(true);
  //   try {
  //     const response = await POST<SuccessResponse>(SIGN_UP, signupData);
  //     const { success, data, error } = response;

  //     if (!success) {
  //       toast.error(error.message);
  //       throw new Error(error.message);
  //     }

  //     toast.success(data.message);
  //     // router.push(ROUTES.LOGIN);
  //   } catch (error) {
  //     console.error("Signup failed:", error);
  //   } finally {
  //     setIsSignupLoading(false);
  //   }
  // };
  // // 이메일 인증 코드 발송 폼 이벤트
  // const onSendCodeSubmit = async ({ email }: SendCodeInputs) => {
  //   console.log("??");
  //   setIsSendCodeLoading(true);
  //   try {
  //     const response = await POST<SuccessResponse>(SEND_VERIFICATION, { email });
  //     const { success, data, error } = response;

  //     if (!success) {
  //       toast.error(error.message);
  //       setverifyCodeFlow({ ...verifyCodeFlow, send: false });
  //       throw new Error(error.message);
  //     }

  //     toast.success(data.message);
  //     setverifyCodeFlow({ ...verifyCodeFlow, send: true });
  //   } catch (error) {
  //     console.error("Send Code failed:", error);
  //   } finally {
  //     setIsSendCodeLoading(false);
  //   }
  // };
  // // 이메일 인증 폼 이벤트
  // const onVerifyCodeSubmit = async ({ email, verifyCode: code }: VerifyCodeInputs) => {
  //   setIsverifyCodeLoading(true);

  //   try {
  //     const response = await POST<SuccessResponse>(VERIFY_CODE, { email, code });
  //     const { success, data, error } = response;

  //     if (!success) {
  //       toast.error(error.message);
  //       setverifyCodeFlow({ ...verifyCodeFlow, verify: false });
  //       throw new Error(error.message);
  //     }

  //     toast.success(data.message);
  //     setverifyCodeFlow({ ...verifyCodeFlow, verify: true });
  //   } catch (error) {
  //     console.error("Verify Code failed:", error);
  //   } finally {
  //     setIsverifyCodeLoading(false);
  //   }
  // };

  // return {
  //   // registers
  //   signupRegister: signupForm.register,
  //   sendCodeRegister: sendCodeForm.register,
  //   verifyCodeRegister: verifyCodeForm.register,

  //   // loadings
  //   isSignupLoading,
  //   isSendCodeLoading,
  //   isverifyCodeLoading,

  //   // 이메일 인증 코드 발송 및 인증 플로우
  //   verifyCodeFlow,

  //   // form events
  //   handleSignupSubmit: signupForm.handleSubmit(onSignupSubmit),
  //   handleSendCodeSubmit: sendCodeForm.handleSubmit(onSendCodeSubmit),
  //   handleVerifyCodeSubmit: verifyCodeForm.handleSubmit(onVerifyCodeSubmit),

  //   // error messages
  //   signupErrors: signupForm.formState.errors,
  //   sendCodeErrors: sendCodeForm.formState.errors,
  //   verifyCodeErrors: verifyCodeForm.formState.errors,
  // };
}
