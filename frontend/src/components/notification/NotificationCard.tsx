import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import type { NotificationResponse } from "../../services/notificationService";
import NotificationStatusChip from "./NotificationStatusChip";

interface NotificationCardProps {
  notification: NotificationResponse;
  onMarkAsRead: (notificationId: number) => void;
  markingAsRead: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString();
};

const NotificationCard = ({
  notification,
  onMarkAsRead,
  markingAsRead,
}: NotificationCardProps) => {
  const isUnread = !notification.is_read;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: 3,
        borderColor: isUnread ? "#c5dfce" : "#e2e8e5",
        backgroundColor: isUnread ? "#f8fcf9" : "#ffffff",
        boxShadow: "0 2px 8px rgba(22, 101, 52, 0.04)",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          borderColor: "#86b99a",
          boxShadow: "0 4px 14px rgba(22, 101, 52, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          {/* Notification Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: isUnread ? "#dcfce7" : "#f3f4f6",
              color: isUnread ? "#166534" : "#6b7280",
            }}
          >
            <NotificationsNoneOutlinedIcon />
          </Box>

          {/* Notification Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title and Status */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: isUnread ? 700 : 600,
                  color: "#1f2937",
                  overflowWrap: "anywhere",
                }}
              >
                {notification.title}
              </Typography>

              <NotificationStatusChip isRead={notification.is_read} />
            </Box>

            {/* Message */}
            <Typography
              variant="body2"
              sx={{
                color: "#4b5563",
                lineHeight: 1.7,
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap",
              }}
            >
              {notification.message}
            </Typography>

            {/* Type and Date */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  px: 1.2,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: "#f0fdf4",
                  color: "#166534",
                  fontWeight: 600,
                  overflowWrap: "anywhere",
                }}
              >
                {notification.notification_type.replace(/_/g, " ")}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <AccessTimeOutlinedIcon
                  sx={{ fontSize: 16, color: "#9ca3af" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(notification.created_at)}
                </Typography>
              </Box>
            </Box>

            {/* Mark as Read Action */}
            {isUnread && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CheckCircleOutlineOutlinedIcon />}
                  disabled={markingAsRead}
                  onClick={() => onMarkAsRead(notification.id)}
                  sx={{
                    borderRadius: 2,
                    borderColor: "#bbd9c4",
                    color: "#166534",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#15803d",
                      backgroundColor: "#f0fdf4",
                    },
                  }}
                >
                  {markingAsRead ? "Updating..." : "Mark as Read"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;

