import React from "react";
import { useParams } from "react-router-dom";
import Verification from "../components/Verification/Verification";

const VerificationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <div className="min-h-screen bg-gray-100 rounded-md flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4 text-center">
          Verify Your Email
        </h1>
        {token ? (
          <Verification />
        ) : (
          <p className="text-red-500 text-center">Invalid verification link.</p>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
