"use client";

import Link from "next/link";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md text-center">
        <CardHeader className="justify-center">
          <div className="rounded-full bg-gray-200 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
        </CardHeader>
        <CardBody className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
          <p className="mt-4 text-gray-600 break-keep">
            요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.
          </p>
          <Button as={Link} href="/" color="primary" className="mt-8">
            돌아가기
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}
