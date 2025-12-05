"use client";
import { useState } from "react";
import Link from "next/link";
import { GROUP_API_URLS } from "@/constants/api/group";
import { Button } from "@heroui/button";
import { ROUTES } from "@/constants/routes";
import { DELETE, POST } from "@/lib/axiosInstans";
import { toast } from "sonner";
import useLoader from "@/hooks/useLoader";
import { SuccessResponse } from "@/types/response_type";
import useCustomRouter from "@/hooks/useCustomRouter";
import { MEMBER_SHIP_CONSTANTS } from "@/constants/group";
import { MemberListType } from "@/types/components";

// 그룹 삭제
export function GroupDeleteButton({ groupSeq }: { groupSeq: number }) {
  const { handleBackRoute } = useCustomRouter();

  const handleGroupDelete = async ({ groupSeq }: { groupSeq: number }) => {
    try {
      const response = await DELETE<SuccessResponse>(GROUP_API_URLS.GROUP + `?groupSeq=${groupSeq}`);

      const { data, success, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error("오류가 발생했습니다.");
      }

      toast.success(data.message);
      handleBackRoute();
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <Button color="danger" type="button" onPress={() => handleGroupDelete({ groupSeq })}>
      그룹삭제
    </Button>
  );
}

// 그룹 수정
export function GroupUpdateButton({ groupSeq }: { groupSeq: number }) {
  const { GROUP, EDIT } = ROUTES;
  return <Link href={`${GROUP}/${groupSeq}/${EDIT}`}>그룹수정</Link>;
}

// 유저 => 그룹 가입 신청
export function GroupPermissionRequestButton({ groupSeq }: { groupSeq: number }) {
  const { setIsLoading } = useLoader(false);
  const requestType = MEMBER_SHIP_CONSTANTS.REQUEST.TYPE.APPLICATION;

  // 그룹 가입 신청 이벤트
  const handleGroupRequest = async () => {
    setIsLoading(true);

    try {
      const response = await POST<SuccessResponse>(GROUP_API_URLS.MEMBER_SHIP, { groupSeq, requestType });

      const { success, error, data } = response;

      console.log(response);

      if (error) {
        console.error(error.message);
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
    } catch (error) {
      console.error("asd", error);
    } finally {
      setIsLoading(false);
    }
  };

  return <button onClick={handleGroupRequest}>가입 신청</button>;
}

export function MemberList({
  isAdmin,
  groupSeq,
  memberList,
}: {
  isAdmin: boolean;
  groupSeq: number;
  memberList: MemberListType;
}) {
  const [userList, setUserList] = useState(memberList);

  const handleDeleteMember = async ({ userSeq }: { userSeq: number }) => {
    try {
      const response = await DELETE<SuccessResponse>(
        GROUP_API_URLS.MEMBER_SHIP + `?groupSeq=${groupSeq}&userSeq=${userSeq}`
      );

      const { data, success, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error("오류가 발생했습니다.");
      }

      const filterMemberList = userList.filter((member) => member.user.seq !== userSeq);

      setUserList(filterMemberList);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  return (
    <div style={{ marginTop: "30px", borderTop: " 1px solid #333" }}>
      <h2 style={{ padding: "30px 0 10px" }}>가입자 리스트</h2>
      {userList.length
        ? userList.map((member, index) => (
            <div key={index} style={{ border: "1px solid #333", padding: "10px" }}>
              <p>{index + 1}.</p>
              <p>{member.role}</p>
              <p>{`${member.user.nickname}#${member.user.discriminator}`}</p>
              <p>{member.user.email}</p>
              {isAdmin && (
                <Button color="danger" type="button" onPress={() => handleDeleteMember({ userSeq: member.user.seq })}>
                  그룹에서 제거
                </Button>
              )}
            </div>
          ))
        : "가입자가 없습니다."}
    </div>
  );
}
