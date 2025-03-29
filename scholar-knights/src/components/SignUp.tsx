import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from 'react-router-dom'; // Import the Link component from react-router-dom

function SignUp() {
  const [name, setName] = useState('Kretes');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full pb-8 mx-auto h-34 bg-gradient-to-r from-violet-500 to-blue-500 mb-[-30px] shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg flex flex-col justify-center">
        <div className="text-center font-medium text-3xl text-white">Scholar Knights</div>
        <div className="text-xl font-bold text-white text-center pt-3">Signup</div>
      </div>
      <div className="max-w-md w-full bg-white p-8 border border-gray-300 shadow-md rounded-b-lg">
        <form action="" className="space-y-6">
          <div className="flex flex-col items-start">
            <label htmlFor="firstName" className="text-sm font-bold text-gray-600">First Name</label>
            <input id="firstName" type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>

          <div className="flex flex-col items-start">
            <label htmlFor="lastName" className="text-sm font-bold text-gray-600">Last Name</label>
            <input id="lastName" type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="email" className="text-sm font-bold text-gray-600">Email</label>
            <input id="email" type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="password" className="text-sm font-bold text-gray-600">Password</label>
            <input id="password" type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
          </div>
          <div className="pt-2">
            <button className="w-full py-2 px-4 bg-violet-500 hover:bg-violet-600 rounded-md text-white text-md font-bold shadow-md hover:shadow-lg transition-shadow duration-300">
              Submit
            </button>
          </div>
          {/* Link to the LoginPage using react-router-dom's Link component */}
          <div className="text-center">
            <Link 
              to="/login" // Replace with the path to your LoginPage
              className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
            >
              Have an account already? Click here to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export { SignUp };
