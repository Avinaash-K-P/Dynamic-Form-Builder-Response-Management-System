import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { toast } from "react-toastify";

import {
  getActivityLogs,
} from "../../services/activityLogService";

import type {
  ActivityLogResponse,
} from "../../services/activityLogService";

import "../../styles/activitylog.css";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLogResponse[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  const loadActivityLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getActivityLogs(page, limit);

      setLogs(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch {
      setError("Unable to load activity logs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadActivityLogs();
  }, [loadActivityLogs]);

  const handleRefresh = async () => {
    await loadActivityLogs();
    toast.info("Activity logs refreshed.");
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) =>
      Math.min(totalPages, current + 1)
    );
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleString();
  };

  const formatLabel = (value: string) =>
    value
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      );

  return (
    <Box className="activity-logs-page">
      <Box className="activity-logs-header">
        <Box>
          <Typography
            variant="h4"
            className="activity-logs-title"
          >
            Activity Logs
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Monitor and review application activities.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshOutlinedIcon />}
          onClick={() => void handleRefresh()}
          disabled={loading}
          className="activity-logs-refresh"
        >
          Refresh
        </Button>
      </Box>

      <Card className="activity-logs-summary">
        <CardContent>
          <Box className="activity-logs-summary-content">
            <Box className="activity-logs-summary-icon">
              <HistoryOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Activity Logs
              </Typography>

              <Typography
                variant="h4"
                className="activity-logs-total"
              >
                {total}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Paper
        elevation={0}
        className="activity-logs-table-section"
      >
        <Box className="activity-logs-table-header">
          <Box>
            <Typography variant="h6">
              Recent Activities
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Review recorded actions and their details.
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void loadActivityLogs()}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading && logs.length === 0 ? (
          <Box className="activity-logs-loading">
            <CircularProgress />
            <Typography color="text.secondary">
              Loading activity logs...
            </Typography>
          </Box>
        ) : logs.length > 0 ? (
          <TableContainer className="activity-logs-table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity Type</TableCell>
                  <TableCell>Entity ID</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.id}</TableCell>

                    <TableCell>
                      {log.user_id ?? "—"}
                    </TableCell>

                    <TableCell>
                      <span className="activity-action-badge">
                        {formatLabel(log.action)}
                      </span>
                    </TableCell>

                    <TableCell>
                      {formatLabel(log.entity_type)}
                    </TableCell>

                    <TableCell>
                      {log.entity_id ?? "—"}
                    </TableCell>

                    <TableCell className="activity-description">
                      {log.description || "—"}
                    </TableCell>

                    <TableCell className="activity-timestamp">
                      {formatDate(log.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          !error && (
            <Box className="activity-logs-empty">
              <HistoryOutlinedIcon />

              <Typography variant="h6">
                No Activity Logs Found
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Recorded application activities will appear here.
              </Typography>
            </Box>
          )
        )}

        {!loading && total > 0 && (
          <Box className="activity-logs-pagination">
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Showing{" "}
              {((page - 1) * limit) + 1}
              {"–"}
              {Math.min(page * limit, total)}
              {" of "}
              {total} records
            </Typography>

            <Box className="activity-logs-pagination-actions">
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
                disabled={
                  page >= totalPages || loading
                }
                onClick={handleNextPage}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ActivityLogs;