"use client";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Button, useDisclosure, Spinner, Chip } from "@heroui/react";
import useLoader from "@/hooks/useLoader";
import { GET, PUT } from "@/lib/axiosInstans";
import { GROUP_API_URLS } from "@/constants/api/group";
import { MemberShipResponse, MemberRequestItem, SuccessResponse } from "@/types/response_type";
import { toast } from "sonner";
import { formattedDate } from "@/utils/date-fns";

type ChipColor = "default" | "success" | "primary" | "secondary" | "warning" | "danger";

const MEMBER_SHIP_STATUS: { [key: string]: { title: string; color: ChipColor } } = {
  PENDING: { title: "대기중", color: "default" },
  APPROVED: { title: "승인", color: "success" },
  DENIED: { title: "거절", color: "danger" },
};
const MEMBER_SHIP_TYPE: { [key: string]: string } = {
  APPLICATION: "가입신청",
  INVITATION: "초대",
};

const { MEMBER_SHIP } = GROUP_API_URLS;

export default function SideDrawer({ userSeq }: { userSeq: number }) {
  const { isLoading, setIsLoading } = useLoader(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [requestList, setRequestList] = useState<MemberRequestItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      getRequestList({});
    }
  }, [isOpen]);

  const getRequestList = async ({ date = 30, status, type }: { date?: number; status?: string; type?: string }) => {
    setIsLoading(true);
    try {
      const urlParam = `?userSeq=${userSeq}&date=${date}&status=${status}&type=${type}`;
      const response = await GET<MemberShipResponse>(MEMBER_SHIP + urlParam);

      const { success, data, error } = response;

      if (!success) {
        console.error(error.message);
        toast.error(error.message);
        throw new Error(error.message);
      }

      const getRequestList = data.result;
      setRequestList(getRequestList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const PutRequest = async ({
    index,
    memberShipSeq,
    groupSeq,
    status,
    role,
  }: {
    index: number;
    memberShipSeq: number;
    groupSeq: number;
    status: string;
    role?: string;
  }) => {
    // setIsLoading(true);
    try {
      const response = await PUT<SuccessResponse>(MEMBER_SHIP, { memberShipSeq, groupSeq, status, role });

      const { success, data, error } = response;

      if (!success) {
        console.error(error.message);
        toast.error(error.message);
        throw new Error(error.message);
      }

      const refreshRequestList = requestList.map((arg, argIndex) => {
        if (index === argIndex) {
          return {
            ...arg,
            status,
          };
        }
        return arg;
      });
      setRequestList(refreshRequestList);
      toast.success(data.message);
      console.log(data, "data");
    } catch (error) {
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen}>알림</Button>
      <Drawer
        isOpen={isOpen}
        motionProps={{
          variants: {
            enter: { opacity: 1, x: 0 },
            exit: { x: 100, opacity: 0 },
          },
        }}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">알림</DrawerHeader>
              <DrawerBody>
                <div className="flex space-center gap-5">
                  <button onClick={() => getRequestList({ date: 0 })}>오늘</button>
                  <button onClick={() => getRequestList({ date: 7 })}>7일</button>
                  <button onClick={() => getRequestList({ date: 30 })}>30일</button>
                </div>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <ul>
                    {requestList.length ? (
                      requestList.map((request, index) => {
                        const { group, user, groupSeq, createdAt, status, seq } = request;
                        return (
                          <li
                            key={index}
                            style={{
                              borderBottom: "1px solid #c8c8c8",
                              padding: "10px 0",
                            }}
                          >
                            <p>{formattedDate(createdAt)}</p>
                            <Chip style={{ color: "#fff" }} color={MEMBER_SHIP_STATUS[status].color}>
                              {MEMBER_SHIP_STATUS[status].title}
                            </Chip>
                            <h4>{group.name}</h4>
                            <p>
                              {userSeq === user.seq ? (
                                // 내가 요청한 상황
                                <>가입신청</>
                              ) : (
                                // 내가 요청 받은 상황
                                <>{`${user.nickname}#${user.discriminator}`} 가입 신청</>
                              )}
                            </p>
                            {userSeq !== user.seq && status === "PENDING" && (
                              <div className="flex align-center gap-2">
                                <Button
                                  color="primary"
                                  onPress={() =>
                                    PutRequest({
                                      index,
                                      memberShipSeq: seq,
                                      groupSeq,
                                      status: "APPROVED",
                                      role: "GUEST",
                                    })
                                  }
                                >
                                  승인
                                </Button>
                                <Button
                                  color="danger"
                                  onPress={() =>
                                    PutRequest({
                                      index,
                                      memberShipSeq: seq,
                                      groupSeq,
                                      status: "DENIED",
                                    })
                                  }
                                >
                                  거절
                                </Button>
                              </div>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <p>알림이 없습니다.</p>
                    )}
                  </ul>
                )}
              </DrawerBody>
              {/* <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter> */}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
