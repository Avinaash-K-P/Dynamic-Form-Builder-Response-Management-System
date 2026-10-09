import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import NotificationCard from "../../components/notification/NotificationCard";

import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";

import type {
  NotificationResponse,
} from "../../services/notificationService";

import "../../styles/notification.css";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";



type NotificationFilter = "all" | "unread" | "read";

const Notifications = () => {
  // Notification data
  const [notifications, setNotifications] = useState<
    NotificationResponse[]
  >([]);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Loading and action states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [markingId, setMarkingId] = useState<number | null>(null);

  // Filter
  const [filter, setFilter] = useState<NotificationFilter>("all");

  // Fetch notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications(page, limit);

      setNotifications(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch {
      setError("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Load notifications when the page changes
  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  // Mark a notification as read
  const handleMarkAsRead = async (
    notificationId: number
  ): Promise<void> => {
    try {
      setMarkingId(notificationId);

      const updatedNotification = await markNotificationAsRead(
        notificationId
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === notificationId
            ? updatedNotification
            : notification
        )
      );

      toast.success("Notification marked as read.");
    } catch {
      toast.error("Unable to update the notification. Please try again.");
    } finally {
      setMarkingId(null);
    }
  };

  // Filter notifications on the currently loaded page
  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter(
        (notification) => !notification.is_read
      );
    }

    if (filter === "read") {
      return notifications.filter(
        (notification) => notification.is_read
      );
    }

    return notifications;
  }, [notifications, filter]);

  // Navigate to the previous page
  const handlePreviousPage = (): void => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  // Navigate to the next page
  const handleNextPage = (): void => {
    setPage((currentPage) =>
      Math.min(totalPages, currentPage + 1)
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.is_read
  ).length;

  return (
    <Box className="notifications-page">
      {/* Page Header */}
      <Box className="notifications-page-header">
        <Box>
          <Typography
            variant="h4"
            className="notifications-page-title"
          >
            Notifications
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Stay updated on your form activity.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshOutlinedIcon />}
          onClick={() => void loadNotifications()}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box className="notification-summary-grid">
        <Card className="notification-summary-card">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Total Notifications
            </Typography>

            <Typography variant="h4" className="notification-summary-number">
              {total}
            </Typography>
          </CardContent>
        </Card>

        <Card className="notification-summary-card">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Unread on This Page
            </Typography>

            <Typography
              variant="h4"
              className="notification-summary-number"
            >
              {unreadCount}
            </Typography>
          </CardContent>
        </Card>

        <Card className="notification-summary-card">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Read on This Page
            </Typography>

            <Typography
              variant="h4"
              className="notification-summary-number"
            >
              {readCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Notification List */}
      <Box className="notification-list-section">
        <Box className="notification-list-header">
          <Typography variant="h6">
            Recent Notifications
          </Typography>

          {/* Filters */}
          <Box className="notification-filter-group">
            <Button
              variant={filter === "all" ? "contained" : "outlined"}
              onClick={() => setFilter("all")}
              className="notification-filter-button"
            >
              All
            </Button>

            <Button
              variant={filter === "unread" ? "contained" : "outlined"}
              onClick={() => setFilter("unread")}
              className="notification-filter-button"
            >
              Unread
            </Button>

            <Button
              variant={filter === "read" ? "contained" : "outlined"}
              onClick={() => setFilter("read")}
              className="notification-filter-button"
            >
              Read
            </Button>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void loadNotifications()}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && notifications.length === 0 ? (
          <Box className="notification-loading">
            <CircularProgress />
            <Typography color="text.secondary">
              Loading notifications...
            </Typography>
          </Box>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              markingAsRead={markingId === notification.id}
            />
          ))
        ) : (
          <Paper className="notification-empty-state">
            <NotificationsNoneOutlinedIcon
              sx={{ fontSize: 48, color: "#9ca3af", mb: 1 }}
            />

            <Typography variant="h6">
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                  ? "No read notifications"
                  : "No notifications yet"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {filter === "all"
                ? "New notifications will appear here when they become available."
                : "Try another filter to view your notifications."}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Pagination */}
      {!loading && total > 0 && (
        <Box className="notification-pagination">
          <Typography variant="body2" color="text.secondary">
            Showing {((page - 1) * limit) + 1}–
            {Math.min(page * limit, total)} of {total} notifications
          </Typography>

          <Box className="notification-pagination-actions">
            <Button
              variant="outlined"
              disabled={page <= 1 || loading}
              onClick={handlePreviousPage}
            >
              Previous
            </Button>

            <Typography variant="body2">
              Page {page} of {totalPages}
            </Typography>

            <Button
              variant="outlined"
              disabled={page >= totalPages || loading}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );

};

export default Notifications;

