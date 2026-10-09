import { Chip } from "@mui/material";
import type { ExportStatus } from "../../services/exportService";

interface ExportStatusChipProps {
status: ExportStatus;
}

const ExportStatusChip = ({ status }: ExportStatusChipProps) => {
const statusConfig: Record<
ExportStatus,
{
label: string;
color: "warning" | "success" | "error";
} > = {
 pending: {
 label: "Pending",
 color: "warning",
 },
 completed: {
 label: "Completed",
 color: "success",
 },
 failed: {
 label: "Failed",
 color: "error",
 },
 };


const config = statusConfig[status];

return (
<Chip
label={config.label}
color={config.color}
size="small"
variant="outlined"
sx={{
fontWeight: 600,
minWidth: 90,
borderRadius: "6px",
textTransform: "capitalize",
}}
/>
);
};

export default ExportStatusChip;
