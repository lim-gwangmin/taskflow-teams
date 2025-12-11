import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { POST } from "@/lib/axiosInstans";
import { AUTH_API_URLS } from "@/constants/api/auth";
import { LoginResponse } from "@/types/response_type";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

const { LOG_IN } = AUTH_API_URLS;

const loginDatas = z.object({
  email: z.email("유효한 이메일 주소를 입력해주세요."),
  password: z
    .string()
    .min(6, "최소 6자리 이상 입력해야합니다.")
    // .regex(/[A-Z]/, "대문자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[a-z]/, "소문자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[0-9]/, "숫자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[^A-Za-z0-9]/, "특수문자를 최소 1개 이상 포함해야 합니다."),
  rememberMe: z.boolean().default(false),
});

type loginSchema = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function useLoginForm() {
  const router = useRouter();
  const { login } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginDatas), // 폼 제출(Submit) 시 유효성 검사를 수행할 함수
    mode: "onSubmit", // 최초 유효성 검사는 제출(Submit) 시에만 실행
    reValidateMode: "onSubmit", // 에러 발생 후 수정할 때도 제출 시에만 재검사 (onChange 검사 방지)
    shouldFocusError: true, // 에러 발생 시 해당 입력창으로 자동 포커스 이동
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (loginData: loginSchema) => {
    setIsLoading(true);
    try {
      const response = await POST<LoginResponse>(LOG_IN, loginData);
      const { success, data, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error(error.message);
      }
      login(data.user);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isLoading,
  };
}
