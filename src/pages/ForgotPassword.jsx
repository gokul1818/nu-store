import { useState } from "react";
import { Link } from "react-router-dom";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { showError, showSuccess } from "../components/AppToast";
import { AuthAPI } from "../services/api"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    setError("");
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await AuthAPI.forgotPassword({ email }); // 👈 Corrected API call
      showSuccess("Password reset link sent to your email!");
      setEmail("");
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Failed to send reset link";
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={submit} className="space-y-4">
          <AppInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            error={error}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
          />

          <AppButton loading={loading} className="w-full">
            Send Reset Link
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
