import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { loginUser } from "../../services/authService";
import type { UserLogin } from "../../services/authService";

import "/src/styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLogin>();

  const onSubmit = async (data: UserLogin) => {
    try {
      setErrorMessage("");

      const response = await loginUser(data);

      // Store authentication tokens
      localStorage.setItem(
        "access_token",
        response.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.refresh_token
      );

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{
        detail?: string;
      }>;

      setErrorMessage(
        axiosError.response?.data?.detail ||
          "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="login-page">
      <Paper
        elevation={0}
        className="login-card"
      >
        <div className="login-header">
          <Typography
            component="h1"
            className="login-title"
          >
            Welcome Back
          </Typography>

          <Typography
            className="login-subtitle"
          >
            Login to access the Dynamic Form Builder
          </Typography>
        </div>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form
          className="login-form"
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
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <div className="login-forgot">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting
              ? "Logging in..."
              : "Login"}
          </Button>

          <div className="login-register">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Login;


