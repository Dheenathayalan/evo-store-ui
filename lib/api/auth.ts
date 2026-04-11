import api from "./client";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  dob: string;
  is_admin: boolean;
}

export const register = (payload: RegisterPayload) => {
  return api.post("/auth/register", payload);
};

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = (payload: LoginPayload) => {
  return api.post("/auth/login", payload);
};
