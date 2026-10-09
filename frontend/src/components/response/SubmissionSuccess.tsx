import React from "react";
import {
Box,
Button,
Paper,
Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";

import "/src/styles/response.css"

interface SubmissionSuccessProps {
formTitle: string;
onBackToForms: () => void;
onViewResponses: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
formTitle,
onBackToForms,
onViewResponses,
}) => {
return ( 
<Box className="submission-success-page"> 
    <Paper className="submission-success-card" elevation={0}> 
        <Box className="submission-success-icon"> 
            <CheckCircleIcon /> 
            </Box>


    <Typography
      variant="h4"
      className="submission-success-title"
    >
      Response Submitted Successfully!
    </Typography>

    <Typography className="submission-success-message">
      Your response to{" "}
      <Box component="span" className="submission-success-form-title">
        {formTitle}
      </Box>{" "}
      has been recorded successfully.
    </Typography>

    <Typography className="submission-success-description">
      Thank you for completing this form. Your answers have been
      submitted for processing.
    </Typography>

    <Box className="submission-success-actions">
      <Button
        variant="contained"
        startIcon={<ArticleIcon />}
        onClick={onBackToForms}
        className="submission-success-primary-button"
      >
        Browse Forms
      </Button>

      <Button
        variant="outlined"
        startIcon={<AssignmentIcon />}
        onClick={onViewResponses}
        className="submission-success-secondary-button"
      >
        View My Responses
      </Button>
    </Box>
  </Paper>
</Box>


);
};

export default SubmissionSuccess;
