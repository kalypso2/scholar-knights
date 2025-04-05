//import React from "react";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col justify-center items-center bg-gray-100">
      <div className="max-w-md w-full bg-gradient-to-r from-violet-500 to-blue-500 py-6 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-t-lg flex flex-col justify-center">
        <div className="text-center font-medium text-3xl text-white">
          Scholar Knights
        </div>
        <div className="text-xl font-bold text-white text-center pt-3">
          Login
        </div>
      </div>
      <LoginForm />
    </div>
  );
};

export { Login };
