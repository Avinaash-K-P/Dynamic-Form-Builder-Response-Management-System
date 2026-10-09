import React from "react";

import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


import {
  type FormFieldResponse,
} from "../../services/formService";

interface FormFieldCardProps {
  field: FormFieldResponse;
  index: number;
  onEdit: (field: FormFieldResponse) => void;
  onDelete: (field: FormFieldResponse) => void;
  onOptions: (field: FormFieldResponse) => void;
}

const getFieldTypeLabel = (fieldType: string): string => {
  const labels: Record<string, string> = {
    text: "Text",
    number: "Number",
    email: "Email",
    date: "Date",
    dropdown: "Dropdown",
    checkbox: "Checkbox",
    radio: "Radio Button",
    file: "File Upload",
    rating: "Rating",
  };

  return (
    labels[fieldType.toLowerCase()] ||
    fieldType
  );
};

const supportsOptions = (fieldType: string): boolean => {
  return ["dropdown", "checkbox", "radio"].includes(
    fieldType.toLowerCase()
  );
};

const FormFieldCard: React.FC<FormFieldCardProps> = ({
  field,
  index,
  onEdit,
  onDelete,
  onOptions,
}) => {

const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
} = useSortable({
  id: field.id,
});

const sortableStyle: React.CSSProperties = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
  position: "relative",
  zIndex: isDragging ? 1 : 0,
};
  
  const fieldTypeLabel = getFieldTypeLabel(field.field_type);

  const hasValidationRules =
    field.validation_rules &&
    Object.keys(field.validation_rules).length > 0;

  const hasConditionalLogic =
    field.conditional_logic &&
    Object.keys(field.conditional_logic).length > 0;

  return (
    <Paper
  ref={setNodeRef}
  elevation={0}
  style={sortableStyle}
  sx={{
    width: "100%",
    border: "1px solid #D1FAE5",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    transition: isDragging ? "none" : "all 0.2s ease",

    "&:hover": {
      borderColor: "#86EFAC",
      boxShadow: "0 4px 12px rgba(20, 83, 45, 0.08)",
    },
  }}
>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        {/* Drag Handle */}
        <Tooltip title="Drag to reorder"> 
          <IconButton
  {...attributes}
  {...listeners}
  size="small"
  aria-label={`Drag ${field.label}`}
  sx={{
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
    color: "#9CA3AF",
    flexShrink: 0,

    "&:hover": {
      color: "#166534",
      backgroundColor: "#F0FDF4",
    },

    "&:active": {
      cursor: "grabbing",
    },
  }}
>
  <DragIndicatorIcon />
</IconButton>
        </Tooltip>

        {/* Field Number */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#DCFCE7",
            color: "#166534",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index + 1}
        </Box>

        {/* Field Information */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1F2937",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {field.label}
          </Typography>        

        <Stack
          direction="row"
          spacing={0.75}
          useFlexGap
          sx={{
            mt: 0.5,
            flexWrap: "wrap",
          }}
        >
            
            <Chip
              label={fieldTypeLabel}
              size="small"
              sx={{
                height: 23,
                backgroundColor: "#F0FDF4",
                color: "#166534",
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            {field.is_required && (
              <Chip
                label="Required"
                size="small"
                sx={{
                  height: 23,
                  backgroundColor: "#FEF2F2",
                  color: "#B91C1C",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}

            {hasValidationRules && (
              <Chip
                label="Validation"
                size="small"
                sx={{
                  height: 23,
                  backgroundColor: "#EFF6FF",
                  color: "#1D4ED8",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}

            {hasConditionalLogic && (
              <Chip
                label="Conditional"
                size="small"
                sx={{
                  height: 23,
                  backgroundColor: "#FFF7ED",
                  color: "#C2410C",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Actions */}
        <Stack
          direction="row"
          spacing={0.25}
          sx={{
            flexShrink: 0,
          }}
        >
          {/* Field Options */}
          {supportsOptions(field.field_type) && (
            <Tooltip title="Manage options">
              <IconButton
                size="small"
                onClick={() => onOptions(field)}
                aria-label={`Manage options for ${field.label}`}
                sx={{
                  color: "#166534",

                  "&:hover": {
                    backgroundColor: "#F0FDF4",
                  },
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Edit */}
          <Tooltip title="Edit field">
            <IconButton
              size="small"
              onClick={() => onEdit(field)}
              aria-label={`Edit ${field.label}`}
              sx={{
                color: "#2563EB",

                "&:hover": {
                  backgroundColor: "#EFF6FF",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete field">
            <IconButton
              size="small"
              onClick={() => onDelete(field)}
              aria-label={`Delete ${field.label}`}
              sx={{
                color: "#DC2626",

                "&:hover": {
                  backgroundColor: "#FEF2F2",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Paper>
  );
};

export default FormFieldCard;

