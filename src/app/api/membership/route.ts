import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RequestStatus, RequestType, Role } from "@prisma/client";
import { getCurrentUser } from "@/services/auth";
import { COMMON_COMMENTS } from "@/constants/comments";

const { CURRENT_USER } = COMMON_COMMENTS.AUTH;
const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;

const REQUEST_STATUS_MAP: Record<string, RequestStatus> = {
  PENDING: RequestStatus.PENDING,
  APPROVED: RequestStatus.APPROVED,
  DENIED: RequestStatus.DENIED,
};
const REQUEST_TYPE_MAP: Record<string, RequestType> = {
  APPLICATION: RequestType.APPLICATION,
  INVITATION: RequestType.INVITATION,
};

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: CURRENT_USER },
        },
        { status: 401 }
      );
    }

    const { seq: userSeq } = currentUser;
    const searchParams = request.nextUrl.searchParams;
    /**
     * seq: 그룹 요청 스퀀스 값
     * groupSeq: 타겟 그룹 스퀀스 값
     * userSeq: 타겟 유저 스퀀스 값
     * status(요청결과): PENDING=대기중, APPROVED=수락, DENIED=거절
     * type(받은요청, 보낸요청): APPLICATION=받은 요청, INVITATION=보낸 요청
     * date(조회 기간): 30=30일, 7=7일, 0=오늘
     */
    const seq = Number(searchParams.get("seq"));
    const groupSeq = Number(searchParams.get("groupSeq"));
    const status = REQUEST_STATUS_MAP[searchParams.get("status")?.toUpperCase() || ""];
    const type = REQUEST_TYPE_MAP[searchParams.get("type")?.toUpperCase() || ""];
    const daysAgo = Number(searchParams.get("date")) || 0;

    // 조회 기간 설정
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);

    // 요청 상세 조회
    if (seq) {
      const findMemberShip = await prisma.membershipRequest.findFirst({
        where: {
          seq,
          OR: [{ user: { seq: userSeq } }, { group: { adminSeq: userSeq } }],
        },
        include: {
          group: {
            select: { seq: true, name: true, description: true },
          },
          user: {
            select: { seq: true, name: true, nickname: true, discriminator: true },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            message: "상세조회 성공",
            result: findMemberShip,
          },
          error: null,
        },
        { status: 200 }
      );
    }

    // 요청 조회
    if (!seq) {
      const findMemberShipList = await prisma.membershipRequest.findMany({
        where: {
          groupSeq: !groupSeq ? undefined : groupSeq,
          status,
          type,
          OR: [{ user: { seq: userSeq } }, { group: { adminSeq: userSeq } }],
          createdAt: { gte: date },
        },
        include: {
          group: {
            select: { seq: true, name: true, description: true },
          },
          user: {
            select: { seq: true, name: true, nickname: true, discriminator: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            message: "요청조회 성공",
            result: findMemberShipList,
          },
          error: null,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(SERVER_ERROR, "500 서버에러 변수 값", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: "500 서버에러 변수 값" },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: CURRENT_USER },
        },
        { status: 401 }
      );
    }

    const { groupSeq, requestType, message = "" } = await request.json();
    const { seq: userSeq } = currentUser;
    /**
     * 유저 => 그룹 신청, 그룹 => 유저로 초대  구분 필요.
     * requestType
     * - APPLICATION: 유저 => 그룹 가입신청
     * - INVITATION: 그룹 => 유저 초대신청
     */

    if (requestType === "APPLICATION" || requestType === "INVITATION") {
      const memberShipType = requestType === "APPLICATION" ? true : false;

      // 중복된 요청인지 확인
      const isDuplicate = await prisma.membershipRequest.findFirst({
        where: { groupSeq, userSeq },
      });

      if (isDuplicate) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            error: { message: `${memberShipType ? "이미 요청한 그룹입니다." : "이미 초대한 유저입니다."}` },
          },
          { status: 402 }
        );
      }

      // 요청 데이터 추가
      const newMemberShipRequest = await prisma.membershipRequest.create({
        data: { groupSeq, userSeq, type: requestType, message },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            message: `${memberShipType ? "가입 요청이" : "초대 신청이"}되었습니다.`,
            result: newMemberShipRequest,
          },
          error: null,
        },
        { status: 200 }
      );
    }

    // 그 외 요청은 정상적이지 않은 요청으로 예외처리
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: "정상적이지 않은 요청입니다." },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(SERVER_ERROR, "500 서버에러 변수 값", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: "500 서버에러 변수 값" },
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    // 유저 인증
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: CURRENT_USER },
        },
        { status: 401 }
      );
    }
    const { targetUserSeq, memberShipSeq, groupSeq: stringGroupSeq, status, role = "GUEST" } = await request.json();
    const { seq: stringUserSeq } = currentUser;

    const seq = Number(memberShipSeq);
    const userSeq = Number(stringUserSeq);
    const groupSeq = Number(stringGroupSeq);

    // 1. 요청자가 그룹 관리자인지 확인
    const isAdmin = await prisma.group.findFirst({
      where: { adminSeq: userSeq },
    });
    // 그룹 관리자가 아닌경우
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: "권한이 없습니다." },
        },
        { status: 402 }
      );
    }

    const MEMBER_STATUS: { [key: string]: { title: string; status: RequestStatus } } = {
      PENDING: {
        title: "대기중",
        status: RequestStatus.PENDING,
      },
      APPROVED: {
        title: "승인",
        status: RequestStatus.APPROVED,
      },
      DENIED: {
        title: "거절",
        status: RequestStatus.DENIED,
      },
    };

    // 2. memberShipRequest status 변경
    await prisma.membershipRequest.update({
      where: { seq },
      data: { status: MEMBER_STATUS[status].status, updatedAt: new Date() },
    });

    const MEMBER_ROLE: { [key: string]: Role } = {
      ADMIN: Role.ADMIN,
      MEMBER: Role.MEMBER,
      VIEWER: Role.VIEWER,
      GUEST: Role.GUEST,
    };
    const getGroupData = await prisma.group.findFirst({
      where: { seq: groupSeq },
    });

    if (!getGroupData) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: "그룹이 존재하지 않습니다." },
        },
        { status: 402 }
      );
    }

    await prisma.membership.upsert({
      where: {
        userSeq_groupId: {
          userSeq: targetUserSeq,
          groupId: getGroupData.id,
        },
      },
      update: {
        role: MEMBER_ROLE[role],
      },
      create: {
        groupId: getGroupData.id,
        userSeq: targetUserSeq,
        groupSeq: groupSeq,
        role: MEMBER_ROLE[role],
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { message: `${MEMBER_STATUS[status].title}되었습니다.` },
        error: null,
      },
      { status: 200 }
    );

    // 3. memberShip 데이터 추가
  } catch (error) {
    console.error(SERVER_ERROR, error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: "서버 오류 발생" },
      },
      { status: 500 }
    );
  }
}
