"use client";

import useCustomRouter from "@/hooks/useCustomRouter";

export default function LogoutButton() {
    const { handleRoute } = useCustomRouter();

    const handleLogout = async () => {
        // 로그아웃 API 호출
        const response = await fetch('/api/auth/logout');

        if (response.ok) {
        // 로그아웃 성공 시 로그인 페이지로 이동
            handleRoute('/login');
        } else {
            alert('로그아웃에 실패했습니다.');
        }
    };

    return (
        <button type="button">
            로그아웃 
        </button>
    )
}