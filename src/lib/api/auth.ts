import { toast } from "sonner";
import { redirect } from "next/navigation";
import { GET } from "../axiosInstans";
import { AUTH_API_URLS } from "@/constants/api/auth";
import { ROUTES } from "@/constants/routes";
import { COMMON_COMMENTS } from "@/constants/comments";
import { SuccessResponse } from "@/types/response_type";

// 로그아웃
const get_logout = async (): Promise<void> => {
  const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;
  // try문 안 redirect 메소드 호출 시 오류로 인한 response 변수 재할당
  let response;

  try {
    response = await GET<SuccessResponse>(AUTH_API_URLS.LOG_OUT);
  } catch (error) {
    console.error("GET Method Error:", error);
  }

  if (!response) {
    toast.error(SERVER_ERROR);
    throw new Error(SERVER_ERROR);
  }

  const { success, data, error } = response;

  if (success) {
    toast.success(data.message);
    redirect(ROUTES.LOGIN);
  } else {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export { get_logout };
