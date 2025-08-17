import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { AxiosError } from "axios";
import { register as apiRegister } from "../../shared/config/api";
import { toast } from "react-toastify";
import "./register.css";

interface IRegisterForm {
  username: string;
  email: string;
  password: string;
}

function Register(){
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IRegisterForm>({ mode: "onTouched" });

  const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    try {
      await apiRegister(data);
      toast.success("Registration successful! Please login.");
      reset();
      navigate("/login");
    } catch (err) {
      const error = err as AxiosError;
      const message =
        (error.response?.data as { message?: string })?.message ||
        "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="register-container">
      <h1>Register Page</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="register-form"
        noValidate
        aria-live="polite"
      >
        <div className="form-field">
          <label className="label-tag" htmlFor="username">
            Username:
          </label>
          <input
            id="username"
            className="input-tag"
            type="text"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
            })}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <div id="username-error" className="error-text" role="status">
              {errors.username.message}
            </div>
          )}
        </div>

        <div className="form-field">
          <label className="label-tag" htmlFor="email">
            Email:
          </label>
          <input
            id="email"
            className="input-tag"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <div id="email-error" className="error-text" role="status">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="form-field">
          <label className="label-tag" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            className="input-tag"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <div id="password-error" className="error-text" role="status">
              {errors.password.message}
            </div>
          )}
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
