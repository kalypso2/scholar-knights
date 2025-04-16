import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `http://www.scholarknights.com/api/reset-password/${token}`,
        { newPassword }
      );

      if (res.status === 200) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/LoginPage"), 3000);
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Reset failed. Please try again.";
      setError(errMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2 justify-center">
        <Lock size={24} /> Reset Your Password
      </h2>

      {message && (
        <div className="flex items-center gap-2 text-green-600 text-sm mb-4 bg-green-50 px-4 py-2 rounded shadow-sm">
          <CheckCircle size={18} /> {message}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded shadow-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium shadow-md transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
