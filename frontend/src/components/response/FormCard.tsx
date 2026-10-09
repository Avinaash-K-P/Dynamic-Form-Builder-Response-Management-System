import React from "react";
import {
Box,
Button,
Card,
CardActions,
CardContent,
Chip,
Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { FormResponse as Form } from "../../services/formService";

interface FormCardProps {
form: Form;
onSelect: () => void;
}

const FormCard: React.FC<FormCardProps> = ({ form, onSelect }) => {
return ( <Card className="form-card" elevation={0}> <CardContent className="form-card-content"> <Box className="form-card-icon"> <DescriptionOutlinedIcon /> </Box>

    <Box className="form-card-heading">
      <Typography variant="h6" className="form-card-title">
        {form.title}
      </Typography>

      <Chip
        label="Available"
        size="small"
        className="form-card-status"
      />
    </Box>

    <Typography className="form-card-description">
      {form.description?.trim() || "No description provided for this form."}
    </Typography>
  </CardContent>

  <CardActions className="form-card-actions">
    <Button
      variant="contained"
      endIcon={<ArrowForwardIcon />}
      onClick={onSelect}
      className="form-card-button"
      fullWidth
    >
      Fill Form
    </Button>
  </CardActions>
</Card>


);
};

export default FormCard;
