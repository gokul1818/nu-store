import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { showError, showSuccess } from "../components/AppToast";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const [form, setForm] = useState({ emailOrPhone: "", password: "" });
  const [errors, setErrors] = useState({});

  // Clear specific field error on change
  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  // Validation
  const validate = () => {
    const temp = {};
    if (!form.emailOrPhone.trim()) temp.emailOrPhone = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.emailOrPhone))
      temp.emailOrPhone = "Invalid email format";

    if (!form.password.trim()) temp.password = "Password is required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Submit
  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await login({ emailOrPhone: form.emailOrPhone, password: form.password });
      showSuccess("Logged in successfully!");
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Login failed";
      showError(message);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={submit} className="space-y-4">
          <AppInput
            label="Email"
            placeholder="Email"
            value={form.emailOrPhone}
            error={errors.emailOrPhone}
            onChange={(e) => updateField("emailOrPhone", e.target.value)}
          />

          <AppInput
            label="Password"
            placeholder="Password"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => updateField("password", e.target.value)}
          />

          <AppButton loading={loading} className="w-full">
            Log In
          </AppButton>
        </form>

        <div className="mt-4 text-sm text-center">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-secondary font-semibold">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
