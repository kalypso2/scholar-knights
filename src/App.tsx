import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateSession from "./pages/CreateSession";
import YourSessions from "./pages/YourSessions";
import FindSession from "./pages/FindSession";
import Courses from "./pages/Courses";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerificationPage from "./pages/VerificationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create-session" element={<CreateSession />} />
          <Route path="your-sessions" element={<YourSessions />} />
          <Route path="find-session" element={<FindSession />} />
          <Route path="courses" element={<Courses />} />
          <Route path="LoginPage" element={<LoginPage />} />
          <Route path="SignupPage" element={<SignupPage />} />
          <Route path="/verify/:token" element={<VerificationPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
