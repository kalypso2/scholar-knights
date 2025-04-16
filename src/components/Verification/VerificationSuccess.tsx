import { CheckCircle } from "lucide-react";

const VerificationSuccess = () => (
  <div className="flex flex-col items-center text-green-600 text-center">
    <div className="flex items-center gap-3 text-lg">
      <CheckCircle size={48} />
      <div className="text-left">
        <p>Your email has been verified successfully!</p>
      </div>
    </div>
    <a
      href="/LoginPage"
      className="mt-6 inline-block bg-indigo-600 text-white px-5 py-2 rounded-2xl hover:bg-indigo-700 transition"
    >
      Go to Login
    </a>
  </div>
);

export default VerificationSuccess;
