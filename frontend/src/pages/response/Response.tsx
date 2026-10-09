import React, { useCallback, useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import AvailableForms from "../../components/response/AvailableForms";
import { getForms } from "../../services/formService";
import type { FormResponse } from "../../services/formService";
import "../../styles/response.css";

const Responses: React.FC = () => {
const navigate = useNavigate();

const [forms, setForms] = useState<FormResponse[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string>("");

// Fetch active forms from the backend
const loadForms = useCallback(async (): Promise<void> => {
try {
setLoading(true);
setError("");


  const response = await getForms();

  setForms(response.filter((form) => form.is_active));
} catch (err: unknown) {
  console.error("Failed to load forms:", err);
  setError("Unable to load available forms. Please try again.");
} finally {
  setLoading(false);
}


}, []);

// Load forms when the page opens
useEffect(() => {
void loadForms();
}, [loadForms]);

// Open the selected form on its own page
const handleSelectForm = (form: FormResponse): void => {
navigate(`/responses/fill/${form.id}`);
};

return ( <Box className="responses-page"> <Box className="responses-header"> <Typography variant="h4" className="responses-title">
Forms & Responses </Typography>

    <Typography className="responses-subtitle">
      Browse available forms and select one to submit your answers.
    </Typography>
  </Box>

  {error && (
    <Alert
      severity="error"
      sx={{ mb: 2 }}
      action={
        <button type="button" onClick={() => void loadForms()}>
          Retry
        </button>
      }
    >
      {error}
    </Alert>
  )}

  <Box className="responses-section">
    <AvailableForms
      forms={forms}
      loading={loading}
      error=""
      onSelectForm={handleSelectForm}
    />
  </Box>
</Box>


);
};

export default Responses;
