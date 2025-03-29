// FeatureCards.js
//import React from "react";

const FeatureCards = () => {
  const cards = [
    {
      title: "Find Study Sessions",
      description:
        "Find other students to refine your knowledge with, learn more, and share ideas with each other.",
    },
    {
      title: "Create a Study Session",
      description:
        "Create a study session, and find fellow students to study with.",
    },
    {
      title: "Find Your Courses",
      description:
        "Pick courses you are taking to find study sessions that are curated towards your field of study.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 rounded-lg font-bold">
            {card.title}
          </div>
          <p className="mt-4 text-center">{card.description}</p>
          <div className="text-center mt-4">
            <button className="bg-purple-500 text-white py-2 px-4 rounded-lg">
              View More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
