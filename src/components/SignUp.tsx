//import React from "react";
import SignUpForm from "./SignUpForm";

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full pb-8 mx-auto h-34 bg-gradient-to-r from-violet-500 to-blue-500 mb-[-30px] shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg flex flex-col justify-center">
        <div className="text-center font-medium text-3xl text-white">
          Scholar Knights
        </div>
        <div className="text-xl font-bold text-white text-center pt-3">
          Signup
        </div>
      </div>
      <SignUpForm />
    </div>
  );
};

export { SignUp };
