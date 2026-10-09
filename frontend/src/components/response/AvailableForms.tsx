import React, { useMemo, useState } from "react";
import {
Alert,
Box,
CircularProgress,
InputAdornment,
TextField,
Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import type { FormResponse as Form } from "../../services/formService";
import FormCard from "./FormCard";

interface AvailableFormsProps {
forms: Form[];
loading?: boolean;
error?: string;
onSelectForm: (form: Form) => void;
}

const AvailableForms: React.FC<AvailableFormsProps> = ({
forms,
loading = false,
error = "",
onSelectForm,
}) => {
const [search, setSearch] = useState("");

const filteredForms = useMemo(() => {
const query = search.trim().toLowerCase();


if (!query) return forms;

return forms.filter(
  (form) =>
    form.title.toLowerCase().includes(query) ||
    (form.description ?? "").toLowerCase().includes(query)
);

}, [forms, search]);

return ( <Box className="available-forms">
{/* Section Header */} <Box className="available-forms-header"> <Typography variant="h5" className="available-forms-title">
Available Forms </Typography>

    <Typography className="available-forms-subtitle">
      Select a form to get started.
    </Typography>
  </Box>

  {/* Search */}
  <TextField
    fullWidth
    size="small"
    placeholder="Search forms..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    className="available-forms-search"
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      },
    }}
  />

  {/* Loading */}
  {loading && (
    <Box className="available-forms-state">
      <CircularProgress size={32} />
      <Typography>Loading available forms...</Typography>
    </Box>
  )}

  {/* Error */}
  {!loading && error && (
    <Alert severity="error" sx={{ mt: 2 }}>
      {error}
    </Alert>
  )}

  {/* Empty */}
  {!loading && !error && forms.length === 0 && (
    <Box className="available-forms-state">
      <Typography variant="h6">No forms available</Typography>
      <Typography>
        There are currently no forms available for you to complete.
      </Typography>
    </Box>
  )}

  {/* No Search Results */}
  {!loading &&
    !error &&
    forms.length > 0 &&
    filteredForms.length === 0 && (
      <Box className="available-forms-state">
        <Typography>No matching forms found.</Typography>
      </Box>
    )}

  {/* Form Cards */}
  {!loading && !error && filteredForms.length > 0 && (
    <Box className="available-forms-grid">
      {filteredForms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onSelect={() => onSelectForm(form)}
        />
      ))}
    </Box>
  )}
</Box>


);
};

export default AvailableForms;
