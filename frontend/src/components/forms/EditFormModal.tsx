import { useEffect } from "react";
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
  updateForm,
  type FormResponse,
  type FormUpdate,
} from "../../services/formService";

interface EditFormModalProps {
  open: boolean;
  form: FormResponse | null;
  onClose: () => void;
  onSuccess: (updatedForm: FormResponse) => void;
}

function EditFormModal({
  open,
  form,
  onClose,
  onSuccess,
}: EditFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormUpdate>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  /*
   * Populate the form whenever the selected form changes.
   */
  useEffect(() => {
    if (form) {
      reset({
        title: form.title,
        description: form.description ?? "",
      });
    }
  }, [form, reset]);

  /*
   * Close modal and reset form.
   */
  const handleClose = () => {
    if (isSubmitting) return;

    reset();
    onClose();
  };

  /*
   * Submit updated form.
   */
  const onSubmit = async (data: FormUpdate) => {
    if (!form) return;

    try {
      const updatedForm = await updateForm(
        form.id,
        data
      );

      toast.success("Form updated successfully!");

      onSuccess(updatedForm);

      reset();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        "Failed to update form. Please try again.";

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
        Edit Form

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
          id="edit-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Form Title */}
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
                message:
                  "Form title must not exceed 255 characters",
              },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isSubmitting}
          />

          {/* Description */}
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

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
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
          form="edit-form"
          variant="contained"
          disabled={isSubmitting || !form}
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
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditFormModal;

