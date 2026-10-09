import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import BuildIcon from "@mui/icons-material/Build";
import DeleteIcon from "@mui/icons-material/Delete";

import type { FormResponse } from "../../services/formService";

interface FormTableProps {
  forms: FormResponse[];
  onEdit: (form: FormResponse) => void;
  onBuilder: (form: FormResponse) => void;
  onDelete: (form: FormResponse) => void;
}

function FormTable({
  forms,
  onEdit,
  onBuilder,
  onDelete,
}: FormTableProps) {
  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (forms.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #DCFCE7",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            py: 7,
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#374151",
              mb: 1,
            }}
          >
            No forms found
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
            }}
          >
            Create a new form to get started.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid #DCFCE7",
        borderRadius: 2,
        overflowX: "auto",
      }}
    >
      <Table sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#F0FDF4",
            }}
          >
            <TableCell
              sx={{
                fontWeight: 700,
                color: "#14532D",
              }}
            >
              Form
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#14532D",
              }}
            >
              Description
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#14532D",
              }}
            >
              Status
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 700,
                color: "#14532D",
              }}
            >
              Created
            </TableCell>

            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                color: "#14532D",
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {forms.map((form) => (
            <TableRow
              key={form.id}
              hover
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              {/* Form */}
              <TableCell>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#1F2937",
                  }}
                >
                  {form.title}
                </Typography>
              </TableCell>

              {/* Description */}
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6B7280",
                    maxWidth: 320,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={form.description || ""}
                >
                  {form.description || "No description"}
                </Typography>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Chip
                  label={form.is_active ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: form.is_active
                      ? "#DCFCE7"
                      : "#F3F4F6",
                    color: form.is_active
                      ? "#166534"
                      : "#6B7280",
                  }}
                />
              </TableCell>

              {/* Created Date */}
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#4B5563",
                  }}
                >
                  {formatDate(form.created_at)}
                </Typography>
              </TableCell>

              {/* Actions */}
              <TableCell align="center">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Tooltip title="Edit Form">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(form)}
                      sx={{
                        color: "#166534",
                        "&:hover": {
                          backgroundColor: "#DCFCE7",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Open Builder">
                    <IconButton
                      size="small"
                      onClick={() => onBuilder(form)}
                      sx={{
                        color: "#15803D",
                        "&:hover": {
                          backgroundColor: "#DCFCE7",
                        },
                      }}
                    >
                      <BuildIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Form">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(form)}
                      sx={{
                        color: "#DC2626",
                        "&:hover": {
                          backgroundColor: "#FEE2E2",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FormTable;

