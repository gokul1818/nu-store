import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

import { showSuccess, showError } from "../components/AppToast";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ----------- CLEAR ERROR ON CHANGE ----------
  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // ----------- VALIDATION ----------
  const validate = () => {
    const temp = {};

    if (!form.firstName.trim()) temp.firstName = "First name is required";

    if (!form.email.trim()) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      temp.email = "Invalid email format";

    if (!form.password.trim()) temp.password = "Password is required";
    else if (form.password.length < 6)
      temp.password = "Password must be at least 6 characters";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ----------- SUBMIT ----------
  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      await register(form);

      showSuccess("Account created successfully!");
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Registration failed";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={submit} className="space-y-4">
          <AppInput
            label="First Name"
            placeholder="First name"
            value={form.firstName}
            error={errors.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
          />

          <AppInput
            label="Email"
            placeholder="Email"
            value={form.email}
            error={errors.email}
            onChange={(e) => updateField("email", e.target.value)}
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
            Create Account
          </AppButton>
          <div className="mt-4 text-sm text-center">
            <span>Already have an account? </span>
            <Link to="/login" className="text-secondary font-semibold">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
