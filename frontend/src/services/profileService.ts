import api from "./api";

/* ================================
   Profile Types
================================ */

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role_id: number;
  role_name: string;
}

export interface ProfileResponse {
  message: string;
  data: UserProfile;
}

export interface UpdateProfile {
  username?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  message: string;
}


/* ================================
   Get Profile
================================ */

export const getProfile =
  async (): Promise<ProfileResponse> => {
    const response =
      await api.get<ProfileResponse>(
        "/profile"
      );

    return response.data;
  };


/* ================================
   Update Profile
================================ */

export const updateProfile =
  async (
    data: UpdateProfile
  ): Promise<UpdateProfileResponse> => {
    const response =
      await api.put<UpdateProfileResponse>(
        "/profile/edit",
        data
      );

    return response.data;
  };

