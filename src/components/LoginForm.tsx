import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://scholarknights.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 border border-gray-300 shadow-md rounded-b-lg">
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-6">
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
          <label htmlFor="password" className="text-sm font-bold text-gray-600">
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
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-violet-500 hover:bg-violet-600 rounded-md text-white text-md font-bold shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            Submit
          </button>
        </div>
        <div className="text-center">
          <Link
            to="/SignupPage"
            className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
          >
            Don't have an account? Signup here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
