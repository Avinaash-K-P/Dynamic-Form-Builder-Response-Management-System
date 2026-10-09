import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { resetPassword } from "../../services/authService";
import type { ResetPassword as ResetPasswordData } from "../../services/authService";

import "../../styles/resetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetToken = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>();

  const newPassword = watch("new_password");

  const onSubmit = async (
    data: ResetPasswordData
  ) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (!resetToken) {
        setErrorMessage(
          "Reset token is missing or invalid."
        );
        return;
      }

      const payload: ResetPasswordData = {
        reset_token: resetToken,
        new_password: data.new_password,
        retype_password: data.retype_password,
      };

      const response = await resetPassword(payload);

      setSuccessMessage(
        response.message ||
          "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<{
        detail?: string;
      }>;

      setErrorMessage(
        axiosError.response?.data?.detail ||
          "Unable to reset password. Please try again."
      );
    }
  };

  return (
    <div className="reset-password-page">
      <Paper
        elevation={0}
        className="reset-password-card"
      >
        <div className="reset-password-header">
          <Typography
            component="h1"
            className="reset-password-title"
          >
            Reset Password
          </Typography>

          <Typography
            className="reset-password-subtitle"
          >
            Create a new password for your account
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
          className="reset-password-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            {...register("new_password", {
              required: "New password is required",
              minLength: {
                value: 6,
                message:
                  "Password must contain at least 6 characters",
              },
            })}
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
          />

          <TextField
            fullWidth
            label="Retype Password"
            type="password"
            margin="normal"
            {...register("retype_password", {
              required: "Please retype your password",
              validate: (value) =>
                value === newPassword ||
                "Passwords do not match",
            })}
            error={!!errors.retype_password}
            helperText={errors.retype_password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting || !resetToken}
            className="reset-password-button"
          >
            {isSubmitting
              ? "Resetting..."
              : "Reset Password"}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default ResetPassword;

