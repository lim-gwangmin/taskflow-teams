import { ReactNode } from "react";
import { getCurrentUser } from "@/services/auth";
import Header from "@/components/layout/Header";
import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";

type DefatultProtectProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: DefatultProtectProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <main>
      <Header currentUser={currentUser} />
      <Container>{children}</Container>
    </main>
  );
}
