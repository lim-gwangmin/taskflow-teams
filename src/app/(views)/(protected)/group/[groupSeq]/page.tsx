// "use client";

// import useLoader from "@/hooks/useLoader";
// import { toast } from "sonner";
// import { PUT, DELETE } from "@/lib/axiosInstans";
// import { GROUP_API_URLS } from "@/constants/api/group";
// import { GroupListResponse } from "@/types/response_type";
// import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { fetchDetailGroup } from "@/lib/fetching/group";
import { ROUTES } from "@/constants/routes";

export default async function GroupDetailPage({ params }: { params: { groupSeq: string } }) {
  try {
    const groupSeq = Number(params.groupSeq);

    if (!groupSeq) {
      throw new Error("groupSeq 데이터 타입이 숫자가 아닙니다.");
    }

    const test = await fetchDetailGroup({ groupSeq });

    console.log(test, "test");
  } catch (error) {
    console.error(error);
    notFound();
  }
  // 그룹 삭제
  // const handleDeletedGrop = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await DELETE<GroupListResponse>(GROUP_API_URLS.GROUP + `?groupSeq=${groupSeq}`);
  //     const { success, data, error } = response;

  //     if (!success) {
  //       toast.error(error.message);
  //       throw new Error(error.message);
  //     }

  //     toast.success(data.message);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return <>????</>;
}
