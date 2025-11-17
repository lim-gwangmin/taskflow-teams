import { create } from "zustand";
import { CurrentUserSchema } from "@/services/auth";

interface UserState {
  currentUser: CurrentUserSchema | null;
  login: (user: CurrentUserSchema) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
}));
