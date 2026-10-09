import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { forgotPassword } from "../../services/authService";
import type { ForgotPassword as ForgotPasswordData } from "../../services/authService";

import "../../styles/forgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>();

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await forgotPassword(data);
      navigate("/reset-password")
      
      setSuccessMessage(
        response.message || "Password reset link sent successfully."
      );
      

    } catch (error) {
      const axiosError = error as AxiosError<{
        detail?: string;
      }>;

      setErrorMessage(
        axiosError.response?.data?.detail ||
          "Unable to process your request. Please try again."
      );
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="forgot-password-page">
      <Paper
        elevation={0}
        className="forgot-password-card"
      >
        <div className="forgot-password-header">
          <Typography
            component="h1"
            className="forgot-password-title"
          >
            Forgot Password
          </Typography>

          <Typography
            className="forgot-password-subtitle"
          >
            Enter your email address to reset your password
          </Typography>
        </div>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form
          className="forgot-password-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <div className="forgot-password-actions">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              className="forgot-submit-button"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              className="forgot-cancel-button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default ForgotPassword;

