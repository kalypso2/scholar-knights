import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FeatureCards from "./components/FeatureCards";
import CreateSession from "./pages/CreateSession";
import YourSessions from "./pages/YourSessions";
import FindSession from "./pages/FindSession";
import Courses from "./pages/Courses";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Outlet } from "react-router-dom"; // Import Outlet

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Page - without Sidebar and Topbar */}
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignupPage" element={<SignupPage />} />

        {/* Layout with Sidebar and Topbar */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/create-session" element={<CreateSession />} />
          <Route path="/your-sessions" element={<YourSessions />} />
          <Route path="/find-session" element={<FindSession />} />
          <Route path="/courses" element={<Courses />} />
        </Route>
      </Routes>
    </Router>
  );
};

// Layout component with Sidebar and Topbar
const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Topbar />
        <Outlet /> {/* Nested routes will be rendered here */}
      </div>
    </div>
  );
};

// Home component (for the "/")
const Home = () => {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="bg-gray-400 text-white text-xl px-4 py-2 inline-block rounded-lg">
          Find people to study with
        </h1>
      </div>
      <FeatureCards />
    </div>
  );
};

export default App;
