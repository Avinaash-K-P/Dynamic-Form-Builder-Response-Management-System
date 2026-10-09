import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import {
  createForm,
  type FormCreate,
  type FormResponse,
} from "../../services/formService";

interface CreateFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (form: FormResponse) => void;
}

function CreateFormModal({
  open,
  onClose,
  onSuccess,
}: CreateFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormCreate>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleClose = () => {
    if (isSubmitting) return;

    reset();
    onClose();
  };

  const onSubmit = async (data: FormCreate) => {
    try {
      const createdForm = await createForm(data);

      toast.success("Form created successfully!");

      reset();
      onSuccess(createdForm);
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        "Failed to create form. Please try again.";

      toast.error(message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
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
        Create New Form

        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form
          id="create-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            label="Form Title"
            fullWidth
            margin="normal"
            placeholder="Enter form title"
            {...register("title", {
              required: "Form title is required",
              minLength: {
                value: 1,
                message: "Form title is required",
              },
              maxLength: {
                value: 255,
                message: "Form title must not exceed 255 characters",
              },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isSubmitting}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            placeholder="Enter form description"
            {...register("description")}
            disabled={isSubmitting}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            color: "#166534",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="create-form"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#16A34A",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#15803D",
            },
          }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress
                size={20}
                color="inherit"
                sx={{ mr: 1 }}
              />
              Creating...
            </>
          ) : (
            "Create Form"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateFormModal;
