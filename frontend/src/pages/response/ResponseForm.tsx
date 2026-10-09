import React, { useCallback, useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import FillForm from "../../components/response/FillForm";
import SubmissionSuccess from "../../components/response/SubmissionSuccess";

import {
getForm,
getFormFields,
getFieldOptions,
} from "../../services/formService";

import type {
FormResponse,
FormFieldResponse,
FieldOptionResponse,
} from "../../services/formService";

import {
createFormResponse,
createResponseDetail,
} from "../../services/responseService";

import "../../styles/response.css";

interface LoadedFormField extends FormFieldResponse {
options?: FieldOptionResponse[];
}

const ResponseForm: React.FC = () => {
const { formId } = useParams<{ formId: string }>();
const navigate = useNavigate();

const [form, setForm] = useState<FormResponse | null>(null);
const [fields, setFields] = useState<LoadedFormField[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [submitting, setSubmitting] = useState<boolean>(false);
const [error, setError] = useState<string>("");
const [submitted, setSubmitted] = useState<boolean>(false);

// Load the selected form, its fields, and field options.
const loadFormDetails = useCallback(async (): Promise<void> => {
if (!formId || !Number.isInteger(Number(formId)) || Number(formId) <= 0) {
setError("Invalid form ID.");
setLoading(false);
return;
}


try {
  setLoading(true);
  setError("");

  const selectedForm = await getForm(Number(formId));

  if (!selectedForm.is_active) {
    setError("This form is no longer available.");
    return;
  }

  const formFields = await getFormFields(Number(formId));

  const fieldsWithOptions: LoadedFormField[] = await Promise.all(
    formFields.map(async (field) => {
      const supportsOptions = [
        "dropdown",
        "checkbox",
        "radio",
      ].includes(field.field_type.toLowerCase());

      if (!supportsOptions) {
        return { ...field, options: [] };
      }

      const options = await getFieldOptions(
        Number(formId),
        field.id
      );

      return {
        ...field,
        options: options
          .filter((option) => option.is_active)
          .sort((a, b) => a.display_order - b.display_order),
      };
    })
  );

  setForm(selectedForm);
  setFields(fieldsWithOptions);
} catch (err: unknown) {
  console.error("Failed to load form details:", err);
  setError("Unable to load this form. Please try again.");
} finally {
  setLoading(false);
}


}, [formId]);

// Fetch form details when the route opens or form ID changes.
useEffect(() => {
void loadFormDetails();
}, [loadFormDetails]);

// Return to the available forms page.
const handleBack = (): void => {
navigate("/responses");
};

// Create the response and save its field values.
const handleSubmit = async (
values: Record<number, unknown>
): Promise<void> => {
if (!form) {
setError("The selected form could not be found.");
return;
}


// File objects require a separate upload mechanism.
const containsFile = Object.values(values).some(
  (value) =>
    typeof File !== "undefined" && value instanceof File
);

if (containsFile) {
  setError(
    "File uploads are not connected yet. Please remove the selected file and try again."
  );
  throw new Error("File upload is not implemented.");
}

try {
  setSubmitting(true);
  setError("");

  const response = await createFormResponse({
    form_id: form.id,
  });

  await Promise.all(
    Object.entries(values).map(([fieldId, value]) =>
      createResponseDetail(response.id, {
        field_id: Number(fieldId),
        response_value: value,
      })
    )
  );

  setSubmitted(true);
} catch (err: unknown) {
  console.error("Failed to submit response:", err);
  setError(
    "Unable to save your response. Please try again."
  );
  throw err;
} finally {
  setSubmitting(false);
}


};

// The page JSX will be added in the next step.
return ( <Box className="responses-page">
{loading ? (
<Box
sx={{
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: 2,
py: 6,
}}
> <CircularProgress /> <Typography>Loading form details...</Typography> </Box>
) : error && !form ? (
<Alert
severity="error"
action={ <button type="button" onClick={handleBack}>
Back to Forms </button>
}
>
{error} </Alert>
) : submitted && form ? ( <SubmissionSuccess
     formTitle={form.title}
     onBackToForms={handleBack}
     onViewResponses={handleBack}
   />
) : form ? (
<>
{error && (
<Alert severity="error" sx={{ mb: 2 }}>
{error} </Alert>
)}


    <FillForm
      form={form}
      fields={fields}
      loading={false}
      submitting={submitting}
      error={error}
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  </>
) : (
  <Alert severity="warning">
    The requested form could not be found.
  </Alert>
)}


  </Box>
);


};

export default ResponseForm;
