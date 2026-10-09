import React, { useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import { useForm, Controller } from "react-hook-form";

import {
  createFormField,
  type FormFieldCreate,
  type FormFieldResponse,
} from "../../services/formService";

import { toast } from "react-toastify";


interface AddFieldModalProps {
  open: boolean;
  formId: number;
  existingFields: FormFieldResponse[];
  onClose: () => void;
  onSuccess: (field: FormFieldResponse) => void;
}


interface AddFieldFormData {
  label: string;
  field_type: string;
  placeholder: string;
  description: string;
  is_required: boolean;

  min_length: string;
  max_length: string;
  pattern: string;

  min: string;
  max: string;
  integer_only: boolean;

  min_date: string;
  max_date: string;

  min_selections: string;
  max_selections: string;

  allowed_extensions: string;
  max_size_mb: string;

  rating_min: string;
  rating_max: string;

  conditional_enabled: boolean;
  conditional_field_id: string;
  conditional_operator: string;
  conditional_value: string;
}


const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio Button" },
  { value: "file", label: "File Upload" },
  { value: "rating", label: "Rating" },
];


const CONDITIONAL_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does Not Contain" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  {
    value: "greater_than_or_equal",
    label: "Greater Than or Equal",
  },
  {
    value: "less_than_or_equal",
    label: "Less Than or Equal",
  },
  { value: "is_empty", label: "Is Empty" },
  { value: "is_not_empty", label: "Is Not Empty" },
];


const defaultValues: AddFieldFormData = {
  label: "",
  field_type: "text",
  placeholder: "",
  description: "",
  is_required: false,

  min_length: "",
  max_length: "",
  pattern: "",

  min: "",
  max: "",
  integer_only: false,

  min_date: "",
  max_date: "",

  min_selections: "",
  max_selections: "",

  allowed_extensions: "",
  max_size_mb: "",

  rating_min: "1",
  rating_max: "5",

  conditional_enabled: false,
  conditional_field_id: "",
  conditional_operator: "equals",
  conditional_value: "",
};


const AddFieldModal: React.FC<AddFieldModalProps> = ({
  open,
  formId,
  existingFields,
  onClose,
  onSuccess,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddFieldFormData>({
    defaultValues,
  });


  const fieldType = watch("field_type");
  const conditionalEnabled = watch("conditional_enabled");
  const conditionalOperator = watch("conditional_operator");


  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);


  const getNextDisplayOrder = (): number => {
    if (existingFields.length === 0) {
      return 1;
    }

    return (
      Math.max(
        ...existingFields.map(
          (field) => field.display_order
        )
      ) + 1
    );
  };


  const buildValidationRules = (
    data: AddFieldFormData
  ) => {
    const rules: Record<string, unknown> = {};


    if (data.field_type === "text") {
      if (data.min_length !== "") {
        rules.min_length = Number(data.min_length);
      }

      if (data.max_length !== "") {
        rules.max_length = Number(data.max_length);
      }

      if (data.pattern.trim()) {
        rules.pattern = data.pattern.trim();
      }
    }


    if (data.field_type === "number") {
      if (data.min !== "") {
        rules.min = Number(data.min);
      }

      if (data.max !== "") {
        rules.max = Number(data.max);
      }

      rules.integer_only = data.integer_only;
    }


    if (data.field_type === "date") {
      if (data.min_date) {
        rules.min_date = data.min_date;
      }

      if (data.max_date) {
        rules.max_date = data.max_date;
      }
    }


    if (data.field_type === "checkbox") {
      if (data.min_selections !== "") {
        rules.min_selections = Number(
          data.min_selections
        );
      }

      if (data.max_selections !== "") {
        rules.max_selections = Number(
          data.max_selections
        );
      }
    }


    if (data.field_type === "file") {
      if (data.allowed_extensions.trim()) {
        rules.allowed_extensions =
          data.allowed_extensions
            .split(",")
            .map((extension) =>
              extension.trim().replace(".", "").toLowerCase()
            )
            .filter(Boolean);
      }

      if (data.max_size_mb !== "") {
        rules.max_size_mb = Number(
          data.max_size_mb
        );
      }
    }


    if (data.field_type === "rating") {
      if (data.rating_min !== "") {
        rules.min = Number(data.rating_min);
      }

      if (data.rating_max !== "") {
        rules.max = Number(data.rating_max);
      }
    }


    return Object.keys(rules).length > 0
      ? rules
      : undefined;
  };


  const onSubmit = async (
    data: AddFieldFormData
  ) => {
    try {
      const validationRules =
        buildValidationRules(data);


      let conditionalLogic = undefined;


      if (data.conditional_enabled) {
        const operator =
          data.conditional_operator as
            | "equals"
            | "not_equals"
            | "contains"
            | "not_contains"
            | "greater_than"
            | "less_than"
            | "greater_than_or_equal"
            | "less_than_or_equal"
            | "is_empty"
            | "is_not_empty";


        conditionalLogic = {
          field_id: Number(
            data.conditional_field_id
          ),
          operator,
          ...(operator !== "is_empty" &&
            operator !== "is_not_empty" && {
              value: data.conditional_value,
            }),
        };
      }


      const payload: FormFieldCreate = {
        label: data.label.trim(),
        field_type: data.field_type,
        placeholder:
          data.placeholder.trim() || undefined,
        description:
          data.description.trim() || undefined,
        is_required: data.is_required,
        display_order: getNextDisplayOrder(),
        validation_rules: validationRules,
        conditional_logic: conditionalLogic,
      };


      const createdField =
        await createFormField(
          formId,
          payload
        );


      toast.success(
        "Form field added successfully!"
      );


      onSuccess(createdField);

      reset(defaultValues);
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        "Failed to add form field. Please try again.";

      toast.error(message);
    }
  };


  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    reset(defaultValues);
    onClose();
  };


  const showValidationSection =
    [
      "text",
      "number",
      "date",
      "checkbox",
      "file",
      "rating",
    ].includes(fieldType);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      className="add-field-modal"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#14532D",
          fontWeight: 700,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AddIcon />
          Add Form Field
        </Box>

        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            minWidth: 40,
            width: 40,
            height: 40,
            color: "#6B7280",
            fontSize: 20,
          }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>


      <DialogContent dividers>
        {/* BASIC INFORMATION */}

        <Typography
          sx={{
            mb: 2,
            color: "#14532D",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Field Information
        </Typography>


        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: 2,
          }}
        >
          <TextField
            label="Field Label"
            fullWidth
            {...register("label", {
              required: "Field label is required",
              minLength: {
                value: 1,
                message: "Field label is required",
              },
              maxLength: {
                value: 255,
                message:
                  "Field label cannot exceed 255 characters",
              },
            })}
            error={!!errors.label}
            helperText={errors.label?.message}
          />


          <Controller
            name="field_type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>
                  Field Type
                </InputLabel>

                <Select
                  {...field}
                  label="Field Type"
                >
                  {FIELD_TYPES.map(
                    (type) => (
                      <MenuItem
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            )}
          />


          <TextField
            label="Placeholder"
            fullWidth
            {...register("placeholder", {
              maxLength: {
                value: 255,
                message:
                  "Placeholder cannot exceed 255 characters",
              },
            })}
            error={!!errors.placeholder}
            helperText={
              errors.placeholder?.message
            }
          />


          <FormControlLabel
            control={
              <Controller
                name="is_required"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(event) =>
                      field.onChange(
                        event.target.checked
                      )
                    }
                  />
                )}
              />
            }
            label="Required Field"
          />


          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={2}
            sx={{
              gridColumn: "1 / -1",
            }}
            {...register("description")}
          />
        </Box>


        {/* VALIDATION RULES */}

        {showValidationSection && (
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop:
                "1px solid #DCFCE7",
            }}
          >
            <Typography
              sx={{
                mb: 2,
                color: "#14532D",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Validation Rules
            </Typography>


            {/* TEXT VALIDATION */}

            {fieldType === "text" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 2,
                }}
              >
                <TextField
                  label="Minimum Length"
                  type="number"
                  {...register(
                    "min_length"
                  )}
                />

                <TextField
                  label="Maximum Length"
                  type="number"
                  {...register(
                    "max_length"
                  )}
                />

                <TextField
                  label="Pattern / Regex"
                  fullWidth
                  sx={{
                    gridColumn:
                      "1 / -1",
                  }}
                  placeholder="Example: ^[A-Za-z ]+$"
                  {...register("pattern")}
                />
              </Box>
            )}


            {/* NUMBER VALIDATION */}

            {fieldType === "number" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 2,
                }}
              >
                <TextField
                  label="Minimum Value"
                  type="number"
                  {...register("min")}
                />

                <TextField
                  label="Maximum Value"
                  type="number"
                  {...register("max")}
                />

                <Controller
                  name="integer_only"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            field.value
                          }
                          onChange={(
                            event
                          ) =>
                            field.onChange(
                              event.target
                                .checked
                            )
                          }
                        />
                      }
                      label="Integer Only"
                    />
                  )}
                />
              </Box>
            )}


            {/* DATE VALIDATION */}

            {fieldType === "date" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 2,
                }}
              >
                <TextField
                  label="Minimum Date"
                  type="date"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register("min_date")}
                />
                <TextField
                  label="Maximum Date"
                  type="date"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register("max_date")}
                />

              </Box>
            )}


            {/* CHECKBOX VALIDATION */}

            {fieldType ===
              "checkbox" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 2,
                }}
              >
                <TextField
                  label="Minimum Selections"
                  type="number"
                  {...register(
                    "min_selections"
                  )}
                />

                <TextField
                  label="Maximum Selections"
                  type="number"
                  {...register(
                    "max_selections"
                  )}
                />
              </Box>
            )}


            {/* FILE VALIDATION */}

            {fieldType === "file" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 2,
                }}
              >
                <TextField
                  label="Allowed Extensions"
                  placeholder="pdf, docx, jpg"
                  {...register(
                    "allowed_extensions"
                  )}
                />

                <TextField
                  label="Maximum Size (MB)"
                  type="number"
                  {...register(
                    "max_size_mb"
                  )}
                />

                <Typography
                  sx={{
                    gridColumn:
                      "1 / -1",
                    color: "#6B7280",
                    fontSize: 12,
                  }}
                >
                  Enter extensions separated
                  by commas. Example:
                  pdf, docx, jpg
                </Typography>
              </Box>
            )}


            {/* RATING VALIDATION */}

            {fieldType === "rating" && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: 2,
                }}
              >
                <TextField
                  label="Minimum Rating"
                  type="number"
                  {...register(
                    "rating_min"
                  )}
                />

                <TextField
                  label="Maximum Rating"
                  type="number"
                  {...register(
                    "rating_max"
                  )}
                />
              </Box>
            )}
          </Box>
        )}


        {/* CONDITIONAL LOGIC */}

        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop:
              "1px solid #DCFCE7",
          }}
        >
          <Typography
            sx={{
              mb: 1,
              color: "#14532D",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Conditional Logic
          </Typography>


          <Controller
            name="conditional_enabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(event) =>
                      field.onChange(
                        event.target.checked
                      )
                    }
                  />
                }
                label="Show this field based on another field"
              />
            )}
          />


          {conditionalEnabled && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: 2,
                mt: 2,
              }}
            >
              <Controller
                name="conditional_field_id"
                control={control}
                rules={{
                  required:
                    "Select a controlling field",
                }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={
                      !!errors.conditional_field_id
                    }
                  >
                    <InputLabel>
                      Controlling Field
                    </InputLabel>

                    <Select
                      {...field}
                      label="Controlling Field"
                    >
                      {existingFields
                        .filter(
                          (existingField) =>
                            existingField.field_type !==
                              "file"
                        )
                        .map(
                          (
                            existingField
                          ) => (
                            <MenuItem
                              key={
                                existingField.id
                              }
                              value={
                                existingField.id
                              }
                            >
                              {
                                existingField.label
                              }
                            </MenuItem>
                          )
                        )}
                    </Select>

                    {errors.conditional_field_id && (
                      <Typography
                        sx={{
                          mt: 0.5,
                          ml: 1.5,
                          color: "#d32f2f",
                          fontSize: 12,
                        }}
                      >
                        {
                          errors
                            .conditional_field_id
                            .message
                        }
                      </Typography>
                    )}
                  </FormControl>
                )}
              />


              <Controller
                name="conditional_operator"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>
                      Operator
                    </InputLabel>

                    <Select
                      {...field}
                      label="Operator"
                    >
                      {CONDITIONAL_OPERATORS.map(
                        (operator) => (
                          <MenuItem
                            key={
                              operator.value
                            }
                            value={
                              operator.value
                            }
                          >
                            {
                              operator.label
                            }
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
              />


              {conditionalOperator !==
                "is_empty" &&
                conditionalOperator !==
                  "is_not_empty" && (
                  <TextField
                    label="Expected Value"
                    fullWidth
                    {...register(
                      "conditional_value",
                      {
                        required:
                          "Expected value is required",
                      }
                    )}
                    error={
                      !!errors.conditional_value
                    }
                    helperText={
                      errors.conditional_value
                        ?.message
                    }
                  />
                )}
            </Box>
          )}
        </Box>
      </DialogContent>


      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
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
          variant="contained"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          sx={{
            minWidth: 130,
            backgroundColor: "#166534",
            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              backgroundColor: "#14532D",
            },
          }}
        >
          {isSubmitting
            ? "Adding..."
            : "Add Field"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default AddFieldModal;
