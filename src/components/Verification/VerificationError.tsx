import { XCircle } from "lucide-react";

const VerificationError = () => (
  <div className="flex flex-col items-center text-red-600 text-center">
    <div className="flex items-center justify-center gap-3 text-lg">
      <XCircle size={32} />
      <p>An error occurred while verifying your email.</p>
    </div>
  </div>
);

export default VerificationError;
