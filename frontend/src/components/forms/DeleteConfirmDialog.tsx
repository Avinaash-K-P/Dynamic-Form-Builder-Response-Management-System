import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import type { FormResponse } from "../../services/formService";

interface DeleteConfirmDialogProps {
  open: boolean;
  form: FormResponse | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmDialog({
  open,
  form,
  loading = false,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const handleClose = () => {
    if (loading) return;

    onClose();
  };

  return (
<Dialog
  open={open}
  onClose={handleClose}
  fullWidth
  maxWidth="xs"
  className="delete-form-dialog"
>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          color: "#14532D",
        }}
      >
        Delete Form

        <IconButton
          onClick={handleClose}
          disabled={loading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 2,
        }}
      >
        <DeleteIcon
          sx={{
            display: "block",
            margin: "0 auto 12px",
            fontSize: 48,
            color: "#DC2626",
          }}
        />

        <Typography
          sx={{
            textAlign: "center",
            color: "#374151",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Are you sure you want to delete this form?
        </Typography>

        {form && (
          <Typography
            sx={{
              mt: 1,
              textAlign: "center",
              fontWeight: 700,
              color: "#14532D",
              wordBreak: "break-word",
            }}
          >
            "{form.title}"
          </Typography>
        )}

        <Typography
          variant="body2"
          sx={{
            mt: 1.5,
            textAlign: "center",
            color: "#6B7280",
          }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            minWidth: 100,
            color: "#166534",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading || !form}
          sx={{
            minWidth: 120,
            backgroundColor: "#DC2626",
            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              backgroundColor: "#B91C1C",
            },
          }}
        >
          {loading ? (
            <>
              <CircularProgress
                size={18}
                color="inherit"
                sx={{ mr: 1 }}
              />
              Deleting...
            </>
          ) : (
            "Delete Form"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmDialog;
