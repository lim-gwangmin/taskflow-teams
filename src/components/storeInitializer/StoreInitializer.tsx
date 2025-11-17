"use client";

import { useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { CurrentUserSchema } from "@/types/auth";

export default function StoreUserInital({ currentUser }: { currentUser: CurrentUserSchema }) {
  const { login } = useUserStore();

  const initialized = useRef(false);

  if (!initialized.current) {
    login(currentUser);
    initialized.current = true;
  }

  return null;
}
