import { notFound } from "next/navigation";
import { GroupParamsType } from "@/types/components";
import { fetchDetailGroup } from "@/lib/fetching/group";
import EditForm from "./editForm";

export default async function EditGroup({ params }: GroupParamsType) {
  try {
    const { groupSeq } = await params;
    const typeofNumberGroupSeq = Number(groupSeq);

    // 타입이 숫자가 아닐경우 404 notFound 페이지 이동
    if (isNaN(typeofNumberGroupSeq)) {
      throw new Error("오류발생: groupSeq가 숫자로 변환할 수 없는 타입입니다.");
    }

    const { data, error } = await fetchDetailGroup({ groupSeq: typeofNumberGroupSeq });

    if (error) {
      throw new Error(error.message);
    }

    const { membership, memberList } = data.result;

    return <EditForm groupSeq={typeofNumberGroupSeq} membership={membership} memberList={memberList} />;
  } catch (error) {
    if (error) {
      console.error(error);
      notFound();
    }
  }
}
