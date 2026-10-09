import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { registerUser } from "../../services/authService";
import type { UserRegister } from "../../services/authService";

import "../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegister>();

  const onSubmit = async (data: UserRegister) => {
    try {
      setErrorMessage("");

      await registerUser(data);

      navigate("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{
        detail?: string;
      }>;

      setErrorMessage(
        axiosError.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="register-page">
      <Paper
        elevation={0}
        className="register-card"
      >
        <div className="register-header">
          <Typography
            component="h1"
            className="register-title"
          >
            Create Account
          </Typography>

          <Typography
            className="register-subtitle"
          >
            Register to access the Dynamic Form Builder
          </Typography>
        </div>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("username", {
              required: "Username is required",
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

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
                message:
                  "Enter a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message:
                  "Password must contain at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            select
            fullWidth
            label="Role"
            margin="normal"
            defaultValue=""
            {...register("role_id", {
              required: "Role is required",
              valueAsNumber: true,
            })}
            error={!!errors.role_id}
            helperText={errors.role_id?.message}
          >
            <MenuItem value="" disabled>
              Select Role
            </MenuItem>

            <MenuItem value={2}>
              Users
            </MenuItem>
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            className="register-button"
          >
            {isSubmitting
              ? "Creating Account..."
              : "Register"}
          </Button>

          <div className="register-login">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Register;
