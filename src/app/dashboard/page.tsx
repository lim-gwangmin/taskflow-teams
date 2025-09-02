import { getCurrentUser } from '@/lib/auth';
import Header from '@/components/layout/Header';
import { User } from '@prisma/client'; // ◀◀◀ 페이지에서도 타입을 import
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const currentUser : User | null | undefined = await getCurrentUser();

  if(!currentUser) {
    redirect('/login');
  };

  return (
    <>
      <Header user={currentUser.name} email={currentUser.email}/>
      <div>
          <h1>Welcome, {currentUser.name}!</h1>
          <p>Your email: {currentUser.email}</p>
      </div>
    </>
  );
}