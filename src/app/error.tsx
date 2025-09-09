"use client";
import { Card, CardBody, CardHeader, Button } from '@heroui/react';


interface Error {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset } : Error) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md text-center">
        <CardHeader className="justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
        </CardHeader>
        <CardBody>
          <h1 className="text-3xl font-bold text-gray-900">
            문제가 발생했습니다
          </h1>
          <p className="mt-4 text-gray-600">
            서비스 이용에 불편을 드려 죄송합니다.
          </p>
          <Button
            onClick={() => reset()}
            color="primary"
            className="mt-8"
          >
            다시 시도
          </Button>
        </CardBody>
      </Card>
    </main>
  )
}