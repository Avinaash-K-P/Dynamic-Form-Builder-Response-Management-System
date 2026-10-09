import React, { useMemo, useState } from "react";
import {
Alert,
Box,
Button,
CircularProgress,
Paper,
Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import type { FormResponse as Form,FormFieldResponse,
FieldOptionResponse, } from "../../services/formService";
import DynamicField from "../../components/response/DynamicField";


export interface FormField extends FormFieldResponse {
options?: FieldOptionResponse[];
}


interface FillFormProps {
form: Form;
fields: FormField[];
loading?: boolean;
submitting?: boolean;
error?: string;
onBack: () => void;
onSubmit: (values: Record<number, unknown>) => void | Promise<void>;
}

interface ConditionalLogic {
field_id?: number;
operator?: string;
value?: unknown;
}

const evaluateCondition = (
logic: ConditionalLogic | null | undefined,
values: Record<number, unknown>
): boolean => {
if (!logic || !logic.field_id || !logic.operator) {
return true;
}

const actualValue = values[logic.field_id];
const expectedValue = logic.value;

switch (logic.operator) {
case "equals":
return actualValue === expectedValue;


case "not_equals":
  return actualValue !== expectedValue;

case "contains":
  return Array.isArray(actualValue)
    ? actualValue.includes(expectedValue)
    : String(actualValue ?? "").includes(String(expectedValue ?? ""));

case "not_contains":
  return Array.isArray(actualValue)
    ? !actualValue.includes(expectedValue)
    : !String(actualValue ?? "").includes(String(expectedValue ?? ""));

case "greater_than":
  return Number(actualValue) > Number(expectedValue);

case "less_than":
  return Number(actualValue) < Number(expectedValue);

case "greater_than_or_equal":
  return Number(actualValue) >= Number(expectedValue);

case "less_than_or_equal":
  return Number(actualValue) <= Number(expectedValue);

case "is_empty":
  return (
    actualValue === undefined ||
    actualValue === null ||
    actualValue === "" ||
    (Array.isArray(actualValue) && actualValue.length === 0)
  );

case "is_not_empty":
  return !(
    actualValue === undefined ||
    actualValue === null ||
    actualValue === "" ||
    (Array.isArray(actualValue) && actualValue.length === 0)
  );

default:
  return true;


}
};

const FillForm: React.FC<FillFormProps> = ({
form,
fields,
loading = false,
submitting = false,
error = "",
onBack,
onSubmit,
}) => {
const [values, setValues] = useState<Record<number, unknown>>({});
const [validationError, setValidationError] = useState("");

const sortedFields = useMemo(
() => [...fields].sort((a, b) => a.display_order - b.display_order),
[fields]
);

const visibleFields = useMemo(
() =>
sortedFields.filter((field) =>
evaluateCondition(
field.conditional_logic as ConditionalLogic | null | undefined,
values
)
),
[sortedFields, values]
);

const handleFieldChange = (fieldId: number, value: unknown) => {
  setValues((previous) => ({
    ...previous,
    [fieldId]: value,
  }));

  setValidationError("");
};

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();
setValidationError("");


for (const field of visibleFields) {
  if (!field.is_required) {
    continue;
  }

  const value = values[field.id];

  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) {
    setValidationError(`${field.label} is required.`);
    return;
  }
}

try {
  const visibleFieldIds = new Set(visibleFields.map((field) => field.id));

  const submittedValues = Object.fromEntries(
    Object.entries(values).filter(([fieldId]) =>
      visibleFieldIds.has(Number(fieldId))
    )
  );

  await onSubmit(submittedValues);
} catch {
  setValidationError("Unable to submit the form. Please try again.");
}


};

return ( <Paper className="fill-form" elevation={0}> <Box className="fill-form-header">
<Button
startIcon={<ArrowBackIcon />}
onClick={onBack}
className="fill-form-back-button"
disabled={submitting}
>
Back to Forms </Button>


    <Typography variant="h4" className="fill-form-title">
      {form.title}
    </Typography>

    <Typography className="fill-form-description">
      {form.description || "Complete the fields below and submit your response."}
    </Typography>
  </Box>

  {error && (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  )}

  {validationError && (
    <Alert severity="warning" sx={{ mb: 2 }}>
      {validationError}
    </Alert>
  )}

  {loading ? (
    <Box className="fill-form-loading">
      <CircularProgress />
      <Typography>Loading form fields...</Typography>
    </Box>
  ) : fields.length === 0 ? (
    <Alert severity="info">
      This form does not have any fields yet.
    </Alert>
  ) : (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box className="fill-form-fields">
        {visibleFields.map((field) => (
          <Box key={field.id} className="fill-form-field">
            <Typography className="fill-form-field-label">
              {field.label}
              {field.is_required && (
                <Box component="span" className="required-marker">
                  {" "}*
                </Box>
              )}
            </Typography>

            {field.description && (
              <Typography className="fill-form-field-description">
                {field.description}
              </Typography>
            )}
<DynamicField
  field={field}
  value={values[field.id]}
  onChange={handleFieldChange}
  disabled={submitting}
/>

            {/* DynamicField will replace this placeholder in the next step. */}

            
          </Box>
        ))}
      </Box>

      <Box className="fill-form-actions">
        <Button
          type="button"
          variant="outlined"
          onClick={onBack}
          disabled={submitting}
          className="fill-form-cancel-button"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={submitting}
          className="fill-form-submit-button"
        >
          {submitting ? "Submitting..." : "Submit Response"}
        </Button>
      </Box>
    </Box>
  )}
</Paper>


);
};

export default FillForm;
