// Verification.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Verifying from "./Verifying";
import VerificationSuccess from "./VerificationSuccess";
import VerificationFailed from "./VerificationFailed";
import VerificationError from "./VerificationError";

interface JWTPayload {
  email?: string;
  exp?: number;
  iat?: number;
}

const Verification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"verifying" | "success" | "failed" | "error">("verifying");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const verify = async () => {
      if (!token) return setStatus("error");

      try {
        const decoded = jwtDecode<JWTPayload>(token);
        if (decoded.email) setEmail(decoded.email);

        const res = await fetch(`http://www.scholarknights.com/api/verify/${token}`, {
          method: "GET",
          credentials: "include"
        });

        if (res.status === 200) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  switch (status) {
    case "verifying":
      return <Verifying />;
    case "success":
      return <VerificationSuccess />;
    case "failed":
      return <VerificationFailed email={email} />;
    case "error":
      return <VerificationError />;
    default:
      return null;
  }
};

export default Verification;

