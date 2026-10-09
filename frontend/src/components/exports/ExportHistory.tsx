import {
Alert,
Box,
Button,
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
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/Refresh";

import type { ExportResponse } from "../../services/exportService";
import ExportStatusChip from "./ExportStatusChip";

interface ExportHistoryProps {
exports: ExportResponse[];
loading: boolean;
error: string;
downloadingId: number | null;
onRefresh: () => void;
onDownload: (exportId: number) => void;
}

const formatDate = (dateString?: string | null): string => {
if (!dateString) {
return "—";
}

const date = new Date(dateString);

if (Number.isNaN(date.getTime())) {
return "—";
}

return date.toLocaleString();
};

const ExportHistory = ({
exports,
loading,
error,
downloadingId,
onRefresh,
onDownload,
}: ExportHistoryProps) => {
return ( <Box>
<Box
sx={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
flexWrap: "wrap",
gap: 2,
mb: 2,
}}
> <Box>
<Typography variant="h6" sx={{ fontWeight: 700, color: "#166534" }}>
Export History </Typography>


      <Typography variant="body2" color="text.secondary">
        Review and download your generated exports.
      </Typography>
    </Box>

    <Button
      variant="outlined"
      startIcon={<RefreshOutlinedIcon />}
      onClick={onRefresh}
      disabled={loading}
      sx={{
        textTransform: "none",
        borderColor: "#15803d",
        color: "#15803d",
        "&:hover": {
          borderColor: "#166534",
          backgroundColor: "#f0fdf4",
        },
      }}
    >
      Refresh
    </Button>
  </Box>

  {error && (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  )}

  <TableContainer
    component={Paper}
    elevation={0}
    sx={{
      border: "1px solid #dcfce7",
      borderRadius: 3,
      overflowX: "auto",
    }}
  >
    <Table sx={{ minWidth: 760 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f0fdf4" }}>
          <TableCell sx={{ fontWeight: 700 }}>Export ID</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Form ID</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Format</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Requested At</TableCell>
          <TableCell sx={{ fontWeight: 700 }}>Completed At</TableCell>
          <TableCell align="center" sx={{ fontWeight: 700 }}>
            Action
          </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {loading && exports.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
              <CircularProgress size={28} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Loading export history...
              </Typography>
            </TableCell>
          </TableRow>
        ) : exports.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
              <FileDownloadOutlinedIcon
                sx={{ fontSize: 40, color: "#86efac", mb: 1 }}
              />

              <Typography sx={{ fontWeight: 600 }}>
                No exports found
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Create an export to see it listed here.
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          exports.map((exportItem) => (
            <TableRow
              key={exportItem.id}
              hover
              sx={{
                "&:last-child td": { borderBottom: 0 },
              }}
            >
              <TableCell>#{exportItem.id}</TableCell>

              <TableCell>{exportItem.form_id}</TableCell>

              <TableCell>
                {exportItem.export_type.toLowerCase() === "excel"
                  ? "Excel (.xlsx)"
                  : exportItem.export_type.toLowerCase() === "pdf"
                    ? "PDF (.pdf)"
                    : exportItem.export_type}
              </TableCell>

              <TableCell>
                <ExportStatusChip status={exportItem.status} />
              </TableCell>

              <TableCell>{formatDate(exportItem.created_at)}</TableCell>

              <TableCell>
                {formatDate(exportItem.completed_at)}
              </TableCell>

              <TableCell align="center">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={
                    downloadingId === exportItem.id ? (
                      <CircularProgress size={15} color="inherit" />
                    ) : (
                      <FileDownloadOutlinedIcon />
                    )
                  }
                  onClick={() => onDownload(exportItem.id)}
                  disabled={
                    exportItem.status !== "completed" ||
                    downloadingId !== null
                  }
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#15803d",
                    "&:hover": { backgroundColor: "#166534" },
                    "&.Mui-disabled": {
                      backgroundColor: "#e2e8f0",
                      color: "#94a3b8",
                    },
                  }}
                >
                  {downloadingId === exportItem.id
                    ? "Downloading..."
                    : "Download"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
</Box>


);
};

export default ExportHistory;
