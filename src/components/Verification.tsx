// components/Verification.tsx
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface VerificationProps {
  token: string;
}

const Verification: React.FC<VerificationProps> = ({ token }) => {
  const [status, setStatus] = useState<
    "verifying" | "success" | "failed" | "error"
  >("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(
          `http://www.scholarknights.com/api/verify/${token}`
        );
        const text = await response.text();

        if (text.toLowerCase().includes("success")) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  const renderMessage = () => {
    const commonClasses =
      "flex items-center justify-center gap-3 text-lg text-center";

    switch (status) {
      case "verifying":
        return <p className="text-lg text-gray-700">Verifying your email...</p>;

      case "success":
        return (
          <div className="flex flex-col items-center text-green-600">
            <div className={commonClasses}>
              <CheckCircle size={48} />
              <p>Your email has been verified successfully!</p>
            </div>
            <a
              href="/login"
              className="mt-6 inline-block bg-indigo-600 text-white px-5 py-2 rounded-2xl hover:bg-indigo-700 transition"
            >
              Go to Login
            </a>
          </div>
        );

      case "failed":
        return (
          <div className="flex flex-col items-center text-red-600">
            <div className={commonClasses}>
              <XCircle size={48} />
              <p>
                Email verification failed. Please try again or request a new
                link.
              </p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center text-red-600">
            <div className={commonClasses}>
              <XCircle size={32} />
              <p>An error occurred while verifying your email.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="text-center">{renderMessage()}</div>;
};

export default Verification;
