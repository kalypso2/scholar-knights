import { XCircle, CheckCircle } from "lucide-react";
import useResendVerification from "../../hooks/useResendVerification";

interface Props {
  email: string;
}

const VerificationFailed: React.FC<Props> = ({ email }) => {
  const { status: resendStatus, resendVerification } = useResendVerification();

  const handleResend = () => {
    resendVerification(email);
  };

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <div className="flex items-center justify-center gap-3 text-lg text-red-600">
        <XCircle size={48} />
        <p>Email verification failed. You can request a new verification link below.</p>
      </div>

      <button
        onClick={handleResend}
        className={`mt-6 px-4 py-2 rounded-2xl text-white transition font-semibold
          ${
            resendStatus === "sending"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        disabled={resendStatus === "sending"}
      >
        {resendStatus === "sending"
          ? "Resending..."
          : resendStatus === "sent"
          ? "Email Sent!"
          : resendStatus === "error"
          ? "Error! Try again"
          : "Resend Verification Email"}
      </button>

      {resendStatus === "sent" && (
        <div className="mt-4 flex items-center text-green-600 text-sm">
          <CheckCircle className="w-4 h-4 mr-2" />
          A new verification email has been sent to <strong className="ml-1">{email}</strong>.
        </div>
      )}
    </div>
  );
};

export default VerificationFailed;
