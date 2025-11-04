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
      <Header currentUser={currentUser} />
      <Container>
        <div>
          <h1>
            반갑습니다! <br />
            {currentUser.nickname}#{currentUser.discriminator} 님!
          </h1>
          <p></p>
        </div>
      </Container>
    </>
  );
}
