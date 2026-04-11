"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),

      isLoggedIn: () => !!get().token,
    }),
    {
      name: "evo-auth", // localStorage key
    },
  ),
);
