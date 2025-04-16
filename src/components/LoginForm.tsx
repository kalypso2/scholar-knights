import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Check, AlertCircle, FileText, MailCheck } from "lucide-react";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotMsg, setForgotMsg] = useState<string>("");

  const [showResend, setShowResend] = useState<boolean>(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowResend(false);

    try {
      const response = await axios.post(
        "http://www.scholarknights.com/api/login",
        { email, password },
        { withCredentials: true }
      );

      const firstName = response.data.first_name;
      const userId = response.data.userId;
      const userEmail = response.data.email;

      if (!firstName || !userId) {
        setError("Login succeeded but user info was incomplete.");
        return;
      }

      localStorage.setItem("userName", firstName);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", userEmail);

      login(firstName);
      navigate("/");
    } catch (err: any) {
      const code = err.response?.data?.code;
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";

      if (code === "EMAIL_NOT_VERIFIED") {
        setShowResend(true);
        setResendStatus("idle");
      }

      setError(errorMessage);
    }
  };

  const handleResendVerification = async () => {
    setResendStatus("sending");
    try {
      await axios.post(
        "http://www.scholarknights.com/api/resend-verification",
        { email },
        { withCredentials: true }
      );
      setResendStatus("sent");
    } catch (err) {
      setResendStatus("error");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg("");

    try {
      await axios.post(
        "http://www.scholarknights.com/api/forgot-password",
        { email: forgotEmail },
        { withCredentials: true }
      );
      setForgotMsg("Reset link sent! Check your email.");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error sending reset link.";
      setForgotMsg(msg);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 border border-gray-300 shadow-md rounded-b-lg">
      {error && (
        <div className="flex items-center text-red-500 text-sm mb-4">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {showResend && (
        <div className="bg-yellow-100 text-yellow-800 text-sm rounded-md px-4 py-3 mb-4">
          <p className="flex items-center gap-2">
            <MailCheck className="w-4 h-4" />
            Your account is not verified. Please check your email.
          </p>
          <button
            onClick={handleResendVerification}
            disabled={resendStatus === "sending"}
            className="mt-2 underline text-violet-600 hover:text-violet-800 font-semibold text-sm"
          >
            {resendStatus === "sending"
              ? "Resending..."
              : resendStatus === "sent"
              ? "Verification email sent!"
              : resendStatus === "error"
              ? "Error sending email. Try again"
              : "Resend Verification Email"}
          </button>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="flex flex-col items-start">
          <label htmlFor="email" className="text-sm font-bold text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col items-start">
          <label htmlFor="password" className="text-sm font-bold text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div
          className="text-sm text-right text-violet-600 hover:underline cursor-pointer"
          onClick={() => setShowForgot(true)}
        >
          Forgot Password?
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-violet-500 hover:bg-violet-600 rounded-md text-white text-md font-bold shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Submit
          </button>
        </div>

        <div className="text-center">
          <Link
            to="/SignupPage"
            className="text-violet-500 hover:text-violet-700 text-lg font-semibold"
          >
            Don't have an account? Signup here
          </Link>
        </div>
      </form>

      {showForgot && (
        <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
          <h3 className="text-md font-semibold flex items-center">
            <FileText className="w-4 h-4 mr-2" /> Reset Password
          </h3>
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-violet-500 text-white py-2 rounded hover:bg-violet-600 transition"
          >
            Send Reset Link
          </button>
          {forgotMsg && (
            <div className="flex items-center justify-center text-sm text-green-600">
              <Check className="w-4 h-4 mr-1" />
              {forgotMsg}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default LoginForm;
