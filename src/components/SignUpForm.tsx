import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import useResendVerification from "../hooks/useResendVerification";

const SignUpForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { status: resendStatus, resendVerification } = useResendVerification();

  const validatePassword = (pwd: string) => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const isLongEnough = pwd.length >= 5;
    return hasUpperCase && isLongEnough;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 5 characters long and include at least one uppercase letter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://www.scholarknights.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 border border-gray-300 shadow-md rounded-b-lg">
      {isSuccess ? (
        <div className="text-center text-green-600 text-lg font-semibold flex flex-col items-center gap-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
          <p>
            A verification email has been sent to{" "}
            <span className="font-bold">{email}</span>.
            <br />
            Please check your inbox and follow the instructions to verify your
            account.
          </p>

          <button
            onClick={() => resendVerification(email)}
            disabled={resendStatus === "sending"}
            className={`mt-2 text-sm font-medium ${
              resendStatus === "sending"
                ? "text-gray-400 cursor-not-allowed"
                : "text-violet-500 hover:text-violet-700 underline"
            }`}
          >
            {resendStatus === "sending"
              ? "Resending..."
              : resendStatus === "sent"
              ? "Verification Email Sent!"
              : resendStatus === "error"
              ? "Error! Try Again"
              : "Resend Verification Email"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSignup} className="space-y-6">
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="flex flex-col items-start">
            <label
              htmlFor="firstName"
              className="text-sm font-bold text-gray-600"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="lastName"
              className="text-sm font-bold text-gray-600"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="username"
              className="text-sm font-bold text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

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
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-start">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-bold text-gray-600"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-violet-500 hover:bg-violet-600 rounded-md text-white text-md font-bold shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              Submit
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/LoginPage"
              className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
            >
              Have an account already? Click here to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignUpForm;
