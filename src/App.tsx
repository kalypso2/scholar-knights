import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateSession from "./pages/CreateSession";
import FindSessionPage from "./pages/FindSessionPage";
import Courses from "./pages/Courses";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerificationPage from "./pages/VerificationPage";
import ViewYourSessionsPage from "./pages/ViewYourSessionsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import ViewSessionDetailsPage from "./pages/ViewSessionDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Routes OUTSIDE of Layout */}
      <Route path="/verify/:token" element={<VerificationPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Routes INSIDE Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="create-session" element={<CreateSession />} />
        <Route path="your-sessions" element={<ViewYourSessionsPage />} />
        <Route path="find-session" element={<FindSessionPage />} />
        <Route path="courses" element={<Courses />} />
        <Route path="LoginPage" element={<LoginPage />} />
        <Route path="SignupPage" element={<SignupPage />} />
        <Route path="ProfilePage" element={<ProfilePage />} />
        <Route
          path="sessions/:sessionId"
          element={<ViewSessionDetailsPage />}
        />
        <Route path="profile/:userId" element={<UserProfilePage />} />
      </Route>
    </Routes>
  );
};

export default App;
