import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../stores/useAdminStore";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import { showError, showSuccess } from "../../components/AppToast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAdminStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const success = await login({ emailOrPhone: form.email, password: form.password });

      if (success !== false) {
        showSuccess("Logged in successfully!");
        navigate("/admin");
      }
    } catch (err) {
      showError(err?.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <AppInput
            label="Email"
            type="email"
            placeholder="admin@example.com"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setErrors((prev) => ({ ...prev, email: null }));
            }}
            error={errors.email}
          />

          {/* Password */}
          <AppInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setErrors((prev) => ({ ...prev, password: null }));
            }}
            error={errors.password}
          />

          {/* Submit button */}
          <AppButton loading={loading} type="submit" className="w-full">
            Login
          </AppButton>
        </form>
      </div>
    </div>
  );
}
