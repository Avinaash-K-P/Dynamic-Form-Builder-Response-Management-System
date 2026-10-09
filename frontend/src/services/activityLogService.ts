import api from "./api";

export interface ActivityLogResponse {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  description: string | null;
  created_at: string;
}

export interface ActivityLogListResponse {
  items: ActivityLogResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const getActivityLogs = async (
  page: number = 1,
  limit: number = 10
): Promise<ActivityLogListResponse> => {
  const response = await api.get<ActivityLogListResponse>(
    "/activity-logs",
    {
      params: { page, limit },
    }
  );

  return response.data;
};

