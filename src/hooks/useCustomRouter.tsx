"use client";

import { useRouter } from "next/navigation";

type CustomRouterReturnWithRouter = {
  handleRoute: (routeUrl: string) => void;
  handleBackRoute: () => void;
  handleRefreshRoute: () => void;
  router: ReturnType<typeof useRouter>;
};

export default function useCustomRouter() : CustomRouterReturnWithRouter {
    const router = useRouter();

    // 페이지 이동
    const handleRoute = ( routeUrl : string ) : void => {
        router.push(routeUrl);
    };

    // 뒤로가기 
    const handleBackRoute = () : void => {
        router.back();
    };

    // 새로고침
    const handleRefreshRoute = () : void => {
        router.refresh();
    }

    return { router, handleRoute, handleBackRoute, handleRefreshRoute }
}