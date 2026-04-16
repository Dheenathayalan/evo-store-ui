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
  isAdmin: boolean;
  setAuth: (token: string, user: User, isAdmin?: boolean) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAdmin: false,

      setAuth: (token, user, isAdmin = false) => set({ token, user, isAdmin }),

      logout: () => set({ token: null, user: null, isAdmin: false }),

      isLoggedIn: () => !!get().token,
    }),
    {
      name: "evo-auth", // localStorage key
    },
  ),
);
