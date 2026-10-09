import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";

import CreateExport from "../../components/exports/CreateExport";
import ExportHistory from "../../components/exports/ExportHistory";

import {
createExport,
getExports,
downloadExport,
} from "../../services/exportService";

import type {
ExportResponse,
ExportType,
} from "../../services/exportService";

import "../../styles/export.css";

const Exports = () => {
const [exports, setExports] = useState<ExportResponse[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [submitting, setSubmitting] = useState<boolean>(false);
const [downloadingId, setDownloadingId] = useState<number | null>(null);
const [error, setError] = useState<string>("");

// Load export history
const loadExports = useCallback(async () => {
try {
setLoading(true);
setError("");


  const data = await getExports();

  // Display newest exports first
  const sortedExports = [...data].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  setExports(sortedExports);
} catch {
  setError("Unable to load export history. Please try again.");
} finally {
  setLoading(false);
}


}, []);

// Load export history when the page opens
useEffect(() => {
void loadExports();
}, [loadExports]);

// Create an export
const handleCreateExport = async (
formId: number,
exportType: ExportType
): Promise<void> => {
try {
setSubmitting(true);


  await createExport({
    form_id: formId,
    export_type: exportType,
  });

  toast.success("Export request created successfully.");

  await loadExports();
} catch {
  toast.error("Unable to create export. Please try again.");
} finally {
  setSubmitting(false);
}


};

// Download a completed export
const handleDownload = async (exportId: number): Promise<void> => {
try {
setDownloadingId(exportId);


  await downloadExport(exportId);

  toast.success("Export download started.");
} catch {
  toast.error("Unable to download the export. Please try again.");
} finally {
  setDownloadingId(null);
}


};

return ( <Box className="exports-page">
{/* Page Header */} <Box className="exports-page-header"> <Box> <Typography variant="h4" className="exports-page-title">
Exports </Typography>


      <Typography variant="body2" color="text.secondary">
        Generate and download form response reports in Excel or PDF format.
      </Typography>
    </Box>
  </Box>

  {/* General Error Message */}
  {error && exports.length === 0 && (
    <Alert
      severity="error"
      sx={{ mb: 3, borderRadius: 2 }}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={() => void loadExports()}
        >
          Retry
        </Button>
      }
    >
      {error}
    </Alert>
  )}

  {/* Create Export Section */}
  <Box className="create-export-section">
    <CreateExport
      onCreateExport={handleCreateExport}
      submitting={submitting}
    />
  </Box>

  {/* Export History Section */}
  <Box className="export-history-section">
    <ExportHistory
      exports={exports}
      loading={loading}
      error={error}
      downloadingId={downloadingId}
      onRefresh={() => void loadExports()}
      onDownload={(exportId) => void handleDownload(exportId)}
    />
  </Box>
</Box>


);
};


export default Exports;
