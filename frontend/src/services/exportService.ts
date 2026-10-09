import api from "./api";

// Export formats supported by the backend
export type ExportType = "excel" | "pdf";

// Export statuses returned by the backend
export type ExportStatus = "pending" | "completed" | "failed";

// Payload for creating an export
export interface ExportCreate {
form_id: number;
export_type: ExportType;
}

// Response returned by the backend
export interface ExportResponse {
id: number;
form_id: number;
requested_by: number;
export_type: ExportType;
status: ExportStatus;
file_path?: string | null;
created_at: string;
completed_at?: string | null;
}

// Response for export status information
export interface ExportStatusResponse {
id: number;
status: ExportStatus;
file_path?: string | null;
completed_at?: string | null;
}

// Create a new export
export const createExport = async (
payload: ExportCreate
): Promise<ExportResponse> => {
const response = await api.post<ExportResponse>("/exports/", payload);
return response.data;
};

// Get all exports for the logged-in administrator
export const getExports = async (): Promise<ExportResponse[]> => {
const response = await api.get<ExportResponse[]>("/exports/");
return response.data;
};

// Get a specific export by ID
export const getExport = async (
exportId: number
): Promise<ExportResponse> => {
const response = await api.get<ExportResponse>(`/exports/${exportId}`);
return response.data;
};

// Download a completed export
export const downloadExport = async (
exportId: number
): Promise<void> => {
const response = await api.get<Blob>(
`/exports/${exportId}/download`,
{
responseType: "blob",
}
);

// Get the filename from the response headers, if available
const contentDisposition = response.headers["content-disposition"];

const filenameMatch =
typeof contentDisposition === "string"
? contentDisposition.match(/filename="?([^";]+)"?/i)
: null;

const filename = filenameMatch?.[1] || `export_${exportId}`;

// Trigger the browser download
const blobUrl = window.URL.createObjectURL(response.data);
const link = document.createElement("a");

link.href = blobUrl;
link.download = filename;

document.body.appendChild(link);
link.click();
link.remove();

// Release the temporary object URL after the download starts
window.setTimeout(() => {
window.URL.revokeObjectURL(blobUrl);
}, 1000);
};
