import { toast } from "sonner";
import { redirect } from "next/navigation";

export const get_logout = async () : Promise<void> => {

    // 로그아웃 API 호출
    const response = await fetch('/api/auth/logout');

    if (response.ok) {
    // 로그아웃 성공 시 로그인 페이지로 이동
        redirect('/login');
    } else {
        toast.error('로그아웃에 실패했습니다.');
    }
}