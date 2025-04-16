import { useState } from "react";

type ResendStatus = "idle" | "sending" | "sent" | "error";

const useResendVerification = () => {
  const [status, setStatus] = useState<ResendStatus>("idle");

  const resendVerification = async (email: string) => {
    if (!email) return;

    setStatus("sending");
    try {
      const response = await fetch(
        "http://www.scholarknights.com/api/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    } finally {
      // optional: revert status back to idle after delay
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return { status, resendVerification };
};

export default useResendVerification;
