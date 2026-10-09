import api from "./api";

/* ================================
   Request Types
================================ */

export interface UserRegister {
  username: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface RefreshToken {
  refresh_token: string;
}

export interface ForgotPassword {
  email: string;
}

export interface ResetPassword {
  reset_token: string;
  new_password: string;
  retype_password: string;
}

/* ================================
   Response Types
================================ */

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MessageResponse {
  message: string;
}

/* ================================
   Register
================================ */

export const registerUser = async (
  data: UserRegister
) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

/* ================================
   Login
================================ */

export const loginUser = async (
  data: UserLogin
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

/* ================================
   Refresh Token
================================ */

export const refreshAccessToken = async (
  data: RefreshToken
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/refresh-token",
    data
  );

  return response.data;
};

/* ================================
   Forgot Password
================================ */

export const forgotPassword = async (
  data: ForgotPassword
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    "/auth/forgot-password",
    data
  );

  return response.data;
};

/* ================================
   Reset Password
================================ */

export const resetPassword = async (
  data: ResetPassword
): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    "/auth/reset-password",
    data
  );

  return response.data;
};

