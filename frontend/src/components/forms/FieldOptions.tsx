import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

import {
  getFieldOptions,
  createFieldOption,
  updateFieldOption,
  deleteFieldOption,
  updateFieldOptionStatus,
} from "../../services/formService";

import type {
  FormFieldResponse,
  FieldOptionResponse,
} from "../../services/formService";

interface FieldOptionsProps {
  open: boolean;
  formId: number;
  field: FormFieldResponse | null;
  onClose: () => void;
}

function FieldOptions({
  open,
  formId,
  field,
  onClose,
}: FieldOptionsProps) {
  const [options, setOptions] = useState<FieldOptionResponse[]>([]);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOptions = async () => {
    if (!field) return;

    try {
      const data = await getFieldOptions(formId, field.id);
      setOptions(data);
    } catch {
      toast.error("Failed to load options");
    }
  };

  useEffect(() => {
    if (open && field) {
      setLabel("");
      setValue("");
      setEditingId(null);
      setDisplayOrder(1);
      loadOptions();
    }
  }, [open, field]);

  const resetForm = () => {
    setLabel("");
    setValue("");
    setEditingId(null);
    setDisplayOrder(options.length + 1);
  };

  const handleSave = async () => {
    if (!field || !label.trim() || !value.trim()) {
      toast.error("Label and value are required");
      return;
    }

    try {
      setLoading(true);

      if (editingId !== null) {
        await updateFieldOption(
          formId,
          field.id,
          editingId,
          {
            label: label.trim(),
            value: value.trim(),
            display_order: displayOrder,
          }
        );

        toast.success("Option updated");
      } else {
        await createFieldOption(
          formId,
          field.id,
          {
            label: label.trim(),
            value: value.trim(),
            display_order: displayOrder,
          }
        );

        toast.success("Option added");
      }

      resetForm();
      await loadOptions();
    } catch {
      toast.error("Failed to save option");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (option: FieldOptionResponse) => {
    setEditingId(option.id);
    setLabel(option.label);
    setValue(option.value);
    setDisplayOrder(option.display_order);
  };

  const handleDelete = async (optionId: number) => {
    if (!field) return;

    if (!window.confirm("Delete this option?")) return;

    try {
      await deleteFieldOption(
        formId,
        field.id,
        optionId
      );

      toast.success("Option deleted");
      await loadOptions();
    } catch {
      toast.error("Failed to delete option");
    }
  };

  const handleStatus = async (
    option: FieldOptionResponse
  ) => {
    if (!field) return;

    try {
      await updateFieldOptionStatus(
        formId,
        field.id,
        option.id,
        {
          is_active: !option.is_active,
        }
      );

      toast.success(
        option.is_active
          ? "Option deactivated"
          : "Option activated"
      );

      await loadOptions();
    } catch {
      toast.error("Failed to update option status");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Manage Options

        {field && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {field.label} ({field.field_type})
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>

          {/* Add / Edit Form */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
          >
            <TextField
              label="Label"
              value={label}
              onChange={(e) =>
                setLabel(e.target.value)
              }
              size="small"
              fullWidth
            />

            <TextField
              label="Value"
              value={value}
              onChange={(e) =>
                setValue(e.target.value)
              }
              size="small"
              fullWidth
            />

            <TextField
              label="Order"
              type="number"
              value={displayOrder}
              onChange={(e) =>
                setDisplayOrder(
                  Number(e.target.value)
                )
              }
              size="small"
              sx={{ width: 100 }}
              slotProps={{
                htmlInput: {
                min: 1,
                },
            }}
            />

            <Button
              variant="contained"
              startIcon={
                editingId !== null
                  ? <EditIcon />
                  : <AddIcon />
              }
              onClick={handleSave}
              disabled={loading}
            >
              {editingId !== null
                ? "Update"
                : "Add"}
            </Button>
          </Stack>

          {editingId !== null && (
            <Button
              size="small"
              onClick={resetForm}
              sx={{ alignSelf: "flex-start" }}
            >
              Cancel Edit
            </Button>
          )}

          {/* Options */}
          {options.length === 0 ? (
            <Typography
              align="center"
              color="text.secondary"
              sx={{ py: 3 }}
            >
              No options added yet.
            </Typography>
          ) : (
            options.map((option) => (
            <Stack direction="row" spacing={1} sx={{ flexDirection: { xs: "column", sm: "row", }, }} >
                <Typography sx={{ flex: 1 }}>
                  {option.label}
                </Typography>

                <Typography
                  sx={{
                    flex: 1,
                    color: "text.secondary",
                  }}
                >
                  {option.value}
                </Typography>

                <Typography>
                  {option.display_order}
                </Typography>

                <Switch
                  size="small"
                  checked={option.is_active}
                  onChange={() =>
                    handleStatus(option)
                  }
                />

                <IconButton
                  size="small"
                  onClick={() =>
                    handleEdit(option)
                  }
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    handleDelete(option.id)
                  }
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FieldOptions;
