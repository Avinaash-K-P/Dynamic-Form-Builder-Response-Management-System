import { useEffect, useState } from "react";
import {
Alert,
Box,
Button,
Card,
CardContent,
CircularProgress,
FormControl,
FormControlLabel,
FormLabel,
MenuItem,
Radio,
RadioGroup,
Select,
Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import { getForms } from "../../services/formService";
import type { FormResponse } from "../../services/formService";
import type { ExportType } from "../../services/exportService";

interface CreateExportProps {
onCreateExport: (formId: number, exportType: ExportType) => Promise<void>;
submitting: boolean;
}

const CreateExport = ({
onCreateExport,
submitting,
}: CreateExportProps) => {
const [forms, setForms] = useState<FormResponse[]>([]);
const [selectedFormId, setSelectedFormId] = useState<number | "">("");
const [exportType, setExportType] = useState<ExportType>("excel");
const [loadingForms, setLoadingForms] = useState(true);
const [formsError, setFormsError] = useState("");

useEffect(() => {
const loadForms = async () => {
try {
setLoadingForms(true);
setFormsError("");


    const data = await getForms();
    const activeForms = data.filter((form) => form.is_active);

    setForms(activeForms);
  } catch {
    setFormsError("Unable to load forms. Please try again.");
  } finally {
    setLoadingForms(false);
  }
};

void loadForms();


}, []);

const handleFormChange = (event: SelectChangeEvent<number | "">) => {
const value = event.target.value;
setSelectedFormId(value === "" ? "" : Number(value));
};

const handleExportTypeChange = (
event: React.ChangeEvent<HTMLInputElement>
) => {
setExportType(event.target.value as ExportType);
};

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
event.preventDefault();


if (selectedFormId === "") {
  return;
}

await onCreateExport(selectedFormId, exportType);


};

return (
<Card
elevation={0}
sx={{
border: "1px solid #dcfce7",
borderRadius: 3,
height: "100%",
}}
>
<CardContent sx={{ p: { xs: 2, sm: 3 } }}>
<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
<FileDownloadOutlinedIcon sx={{ color: "#15803d" }} />
<Typography
  variant="h6"
  sx={{ fontWeight: 700, color: "#166534" }}
>
  Create New Export
</Typography> </Box>


    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Select a form and export format to generate a downloadable report.
    </Typography>

    {formsError && (
      <Alert
        severity="error"
        sx={{ mb: 2 }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        }
      >
        {formsError}
      </Alert>
    )}

    {!loadingForms && !formsError && forms.length === 0 && (
      <Alert severity="info" sx={{ mb: 2 }}>
        No active forms are available for export.
      </Alert>
    )}

    <Box component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth required disabled={loadingForms || submitting}>
        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
          Select Form
        </FormLabel>

<Select<number | "">
  value={selectedFormId}
  onChange={handleFormChange}
  displayEmpty
  renderValue={(value) => {
    if (value === "") {
      return "Choose a form";
    }

    return (
      forms.find((form) => form.id === value)?.title ??
      "Selected form"
    );
  }}
>
          <MenuItem value="">
            <em>Choose a form</em>
          </MenuItem>

          {forms.map((form) => (
            <MenuItem key={form.id} value={form.id}>
              {form.title}
            </MenuItem>
          ))}
        </Select>

        {loadingForms && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption" color="text.secondary">
              Loading forms...
            </Typography>
          </Box>
        )}
      </FormControl>

      <FormControl
        component="fieldset"
        sx={{ mt: 3, width: "100%" }}
        disabled={submitting}
      >
        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
          Export Format
        </FormLabel>

        <RadioGroup
          row
          value={exportType}
          onChange={handleExportTypeChange}
          sx={{ gap: 2 }}
        >
          <FormControlLabel
            value="excel"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TableChartOutlinedIcon sx={{ color: "#15803d" }} />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>Excel</Typography>
                  <Typography variant="caption" color="text.secondary">
                    .xlsx
                  </Typography>
                </Box>
              </Box>
            }
          />

          <FormControlLabel
            value="pdf"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PictureAsPdfOutlinedIcon sx={{ color: "#dc2626" }} />
                <Box>
                 <Typography sx={{ fontWeight: 600 }}>Excel</Typography>
                  <Typography variant="caption" color="text.secondary">
                    .pdf
                  </Typography>
                </Box>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={
          loadingForms ||
          formsError !== "" ||
          forms.length === 0 ||
          selectedFormId === "" ||
          submitting
        }
        startIcon={
          submitting ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <FileDownloadOutlinedIcon />
          )
        }
        sx={{
          mt: 3,
          py: 1.2,
          borderRadius: 2,
          backgroundColor: "#15803d",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": { backgroundColor: "#166534" },
        }}
      >
        {submitting ? "Generating Export..." : "Generate Export"}
      </Button>
    </Box>
  </CardContent>
</Card>


);
};

export default CreateExport;
