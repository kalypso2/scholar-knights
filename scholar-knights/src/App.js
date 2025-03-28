import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import FeatureCards from "./components/FeatureCards";
import CreateSession from "./pages/CreateSession";
import YourSessions from "./pages/YourSessions";
import FindSession from "./pages/FindSession";
import Courses from "./pages/Courses";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <Topbar />
          <Routes>
            {/* Homepage */}
            <Route
              path="/"
              element={
                <div>
                  <div className="text-center mb-6">
                    <h1 className="bg-gray-400 text-white text-xl px-4 py-2 inline-block rounded-lg">
                      Find people to study with
                    </h1>
                  </div>
                  <FeatureCards />
                </div>
              }
            />

            {/* Other Pages */}
            <Route path="/create-session" element={<CreateSession />} />
            <Route path="/your-sessions" element={<YourSessions />} />
            <Route path="/find-session" element={<FindSession />} />
            <Route path="/courses" element={<Courses />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
