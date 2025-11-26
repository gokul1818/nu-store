import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { showError, showSuccess } from "../components/AppToast";
import { AuthAPI } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams(); 
  const navigate = useNavigate();

  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setData({ ...data, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  // Validation
  const validate = () => {
    const temp = {};

    if (!data.password.trim()) temp.password = "Password is required";
    else if (data.password.length < 6)
      temp.password = "Password must be at least 6 characters";

    if (!data.confirmPassword.trim())
      temp.confirmPassword = "Confirm Password is required";
    else if (data.password !== data.confirmPassword)
      temp.confirmPassword = "Passwords do not match";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Submit
  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await AuthAPI.resetPassword({ token, newPassword: data.password });
      showSuccess("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Failed to reset password";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <form onSubmit={submit} className="space-y-4">
          <AppInput
            label="New Password"
            placeholder="Enter new password"
            type="password"
            value={data.password}
            error={errors.password}
            onChange={(e) => updateField("password", e.target.value)}
          />

          <AppInput
            label="Confirm Password"
            placeholder="Confirm new password"
            type="password"
            value={data.confirmPassword}
            error={errors.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
          />

          <AppButton loading={loading} className="w-full">
            Reset Password
          </AppButton>
        </form>

        <div className="mt-4 text-sm text-center">
          <Link to="/login" className="text-secondary font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
