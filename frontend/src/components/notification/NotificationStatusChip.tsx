import { Chip } from "@mui/material";

interface NotificationStatusChipProps {
  isRead: boolean;
}

const NotificationStatusChip = ({
  isRead,
}: NotificationStatusChipProps) => {
  return (
    <Chip
      label={isRead ? "Read" : "Unread"}
      size="small"
      color={isRead ? "success" : "warning"}
      variant="outlined"
      sx={{
        minWidth: 76,
        fontWeight: 600,
        borderRadius: "6px",
        textTransform: "capitalize",
      }}
    />
  );
};

export default NotificationStatusChip;
