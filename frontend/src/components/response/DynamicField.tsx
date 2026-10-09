import React from "react";
import {
Box,
Checkbox,
FormControl,
FormControlLabel,
FormHelperText,
InputLabel,
MenuItem,
Radio,
RadioGroup,
Rating,
Select,
TextField,
Typography,
} from "@mui/material";

import type {
  ValidationRules,
  FieldOptionResponse,
} from "../../services/formService";

export interface FieldOption {
id: number;
field_id: number;
label: string;
value: string;
display_order: number;
is_active: boolean;
}

export interface DynamicFieldConfig {
id: number;
label: string;
field_type: string;
placeholder?: string | null;
description?: string | null;
is_required: boolean;
validation_rules?: ValidationRules | null;
options?: FieldOptionResponse[];
}


interface DynamicFieldProps {
field: DynamicFieldConfig;
value: unknown;
onChange: (fieldId: number, value: unknown) => void;
error?: string;
disabled?: boolean;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
field,
value,
onChange,
error = "",
disabled = false,
}) => {
const handleChange = (newValue: unknown) => {
onChange(field.id, newValue);
};

const options = (field.options ?? [])
.filter((option) => option.is_active)
.sort((a, b) => a.display_order - b.display_order);

const commonTextFieldProps = {
fullWidth: true,
size: "small" as const,
placeholder: field.placeholder ?? "",
required: field.is_required,
disabled,
error: Boolean(error),
helperText: error || undefined,
};

switch (field.field_type.toLowerCase()) {
case "text":
return (
<TextField
{...commonTextFieldProps}
type="text"
value={typeof value === "string" ? value : ""}
onChange={(event) => handleChange(event.target.value)}
/>
);

case "number":
  return (
    <TextField
      {...commonTextFieldProps}
      type="number"
      value={value ?? ""}
      onChange={(event) => {
        const input = event.target.value;
        handleChange(input === "" ? "" : Number(input));
      }}
      slotProps={{
        htmlInput: {
          min: field.validation_rules?.min as number | undefined,
          max: field.validation_rules?.max as number | undefined,
          step: field.validation_rules?.step as number | undefined,
        },
      }}
    />
  );

case "email":
  return (
    <TextField
      {...commonTextFieldProps}
      type="email"
      value={typeof value === "string" ? value : ""}
      onChange={(event) => handleChange(event.target.value)}
    />
  );

case "date":
  return (
    <TextField
      {...commonTextFieldProps}
      type="date"
      value={typeof value === "string" ? value : ""}
      onChange={(event) => handleChange(event.target.value)}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />
  );

case "dropdown":
  return (
    <FormControl
      fullWidth
      size="small"
      required={field.is_required}
      disabled={disabled}
      error={Boolean(error)}
    >
      <InputLabel id={`field-${field.id}-label`}>
        {field.placeholder || "Select an option"}
      </InputLabel>

      <Select
        labelId={`field-${field.id}-label`}
        value={typeof value === "string" ? value : ""}
        label={field.placeholder || "Select an option"}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );

case "checkbox": {
  const selectedValues = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <Box>
      {options.length > 0 ? (
        options.map((option) => (
          <FormControlLabel
            key={option.id}
            label={option.label}
            control={
              <Checkbox
                checked={selectedValues.includes(option.value)}
                disabled={disabled}
                onChange={(event) => {
                  const updatedValues = event.target.checked
                    ? [...selectedValues, option.value]
                    : selectedValues.filter(
                        (item) => item !== option.value
                      );

                  handleChange(updatedValues);
                }}
              />
            }
          />
        ))
      ) : (
        <FormControlLabel
          label={field.placeholder || field.label}
          control={
            <Checkbox
              checked={value === true}
              disabled={disabled}
              onChange={(event) => handleChange(event.target.checked)}
            />
          }
        />
      )}

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );
}

case "radio":
  return (
    <FormControl
      component="fieldset"
      required={field.is_required}
      disabled={disabled}
      error={Boolean(error)}
    >
      <RadioGroup
        value={typeof value === "string" ? value : ""}
        onChange={(event) => handleChange(event.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.value}
            label={option.label}
            control={<Radio />}
          />
        ))}
      </RadioGroup>

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );

case "file":
  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        type="file"
        required={field.is_required}
        disabled={disabled}
        error={Boolean(error)}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0] ?? null;
          handleChange(file);
        }}
        slotProps={{
          htmlInput: {
            accept: field.validation_rules?.accept as string | undefined,
          },
        }}
      />

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );

case "rating": {
  const ratingValue =
    typeof value === "number" && Number.isFinite(value) ? value : null;

  return (
    <Box>
      <Rating
        value={ratingValue}
        max={Number(field.validation_rules?.max ?? 5)}
        precision={1}
        disabled={disabled}
        onChange={(_, newValue) => handleChange(newValue)}
      />

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Box>
  );
}

default:
  return (
    <Typography color="error" variant="body2">
      Unsupported field type: {field.field_type}
    </Typography>
  );


}
};

export default DynamicField;
