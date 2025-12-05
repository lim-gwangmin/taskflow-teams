import Link from "next/link";
import { fetchDetailGroup } from "@/lib/fetching/group";
import { notFound } from "next/navigation";
import { formattedDate } from "@/utils/date-fns";
import { Button } from "@heroui/button";
import { ROUTES } from "@/constants/routes";
import { GroupParamsType, GroupDetailDataType } from "@/types/components";
import {
  GroupDeleteButton,
  GroupUpdateButton,
  GroupPermissionRequestButton,
  MemberList,
} from "@/components/button/GroupUpdateButtons";

// 그룹 상세 페이지
const GetGroupDetailComponent = ({ membership, memberList }: GroupDetailDataType) => {
  const { group, role, groupSeq, user } = membership;
  const isAdmin = role === "ADMIN" ? true : false;
  const joinedAt = formattedDate(membership.joinedAt);
  const createdAt = formattedDate(group.createdAt);
  return (
    <div>
      <div>
        {isAdmin && (
          <section>
            <GroupUpdateButton groupSeq={groupSeq} />
            <GroupDeleteButton groupSeq={groupSeq} />
          </section>
        )}
        <section>
          <h4>그룹명</h4>
          <p>{group.name}</p>
        </section>
        <section>
          <h4>내 권한</h4>
          <p>{role}</p>
        </section>
        <section>
          <h4>그룹 소개</h4>
          <p>{group.description}</p>
        </section>
        <section>
          <h4>그룹 생성일</h4>
          <p>{createdAt}</p>
        </section>
        <section>
          <h4>관리자</h4>
          <p>{`${user.nickname}#${user.discriminator}`}</p>
        </section>
        <section>
          <h4>그룹 가입일</h4>
          <p>{joinedAt}</p>
        </section>
      </div>
      <MemberList isAdmin={isAdmin} groupSeq={groupSeq} memberList={memberList} />
    </div>
  );
};

// 권한이 없다는 페이지
const NotPermissionComponent = ({ groupSeq, url = "/" }: { groupSeq: number; url: string }) => (
  <div>
    <h4>권한이 없습니다.</h4>
    <GroupPermissionRequestButton groupSeq={groupSeq} />
    <Link href={url}>뒤로가기</Link>
  </div>
);

export default async function GroupDetailPage({ params }: GroupParamsType) {
  try {
    const { groupSeq } = await params;
    const typeofNumberGroupSeq = Number(groupSeq);

    // 타입이 숫자가 아닐경우 404 notFound 페이지 이동
    if (isNaN(typeofNumberGroupSeq)) {
      console.error("오류발생: groupSeq가 숫자로 변환할 수 없는 타입입니다.");
      notFound();
    }

    const { data, error } = await fetchDetailGroup({ groupSeq: typeofNumberGroupSeq });

    // 권한이 없거나 예외 에러가 발생했을 시
    if (error) {
      console.error(error.message);
      return NotPermissionComponent({ groupSeq: typeofNumberGroupSeq, url: ROUTES.GROUP });
    }

    const { membership, memberList } = data.result;
    // 그룹 데이터 리턴
    return GetGroupDetailComponent({ membership, memberList });
  } catch (error) {
    console.error("GroupDetailPage error: ", error);
    notFound();
  }
}
