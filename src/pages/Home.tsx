import React from "react";
import scholarKnightsPhoto from "../assets/scholar-knights-photo.png"; // Adjust path if needed

const Home: React.FC = () => {
  return (
    <div
      className="relative bg-cover bg-center h-[500px] flex items-center justify-center"
      style={{ backgroundImage: `url(${scholarKnightsPhoto})` }}
    >
      <div className="bg-black bg-opacity/50 text-white text-xl px-4 py-2 rounded-lg">
        Find people to study with
      </div>
    </div>
  );
};

export default Home;
