import api from "./api";

// Notification types
export interface NotificationResponse {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  read_at?: string | null;
}

// Paginated notification response
export interface NotificationListResponse {
  items: NotificationResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Fetch paginated notifications
export const getNotifications = async (
  page: number = 1,
  limit: number = 10
): Promise<NotificationListResponse> => {
  const response = await api.get<NotificationListResponse>(
    "/notification/",
    {
      params: { page, limit },
    }
  );

  return response.data;
};

// Fetch a single notification
export const getNotification = async (
  notificationId: number
): Promise<NotificationResponse> => {
  const response = await api.get<NotificationResponse>(
    `/notification/${notificationId}`
  );

  return response.data;
};

// Mark a notification as read
export const markNotificationAsRead = async (
  notificationId: number
): Promise<NotificationResponse> => {
  const response = await api.get<NotificationResponse>(
    `/notification-mark/${notificationId}`
  );

  return response.data;
};

