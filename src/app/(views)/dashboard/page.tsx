import { getCurrentUser } from "@/services/auth";
import Header from "@/components/layout/Header";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Container from "@/components/layout/Container";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <>
      <Header user={currentUser.name} email={currentUser.email} />
      <Container>
        <div>
          <h1>Welcome, {currentUser.name}!</h1>
          <p>Your email: {currentUser.email}</p>
        </div>
      </Container>
    </>
  );
}
