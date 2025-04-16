import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

interface Card {
  title: string;
  description: string;
  link: string; // New property to store the redirect path
}

const FeatureCards: React.FC = () => {
  // Update each card with a route for redirection.
  const cards: Card[] = [
    {
      title: "Find Study Sessions",
      description:
        "Find other students to refine your knowledge with, learn more, and share ideas with each other.",
      link: "/find-session", // Example redirect URL
    },
    {
      title: "Create a Study Session",
      description:
        "Create a study session, invite other students, and collaborate to better understand the material together.",
      link: "/create-session", // Example redirect URL
    },
    {
      title: "Find Your Courses",
      description:
        "Pick courses you are taking to find study sessions that are curated towards your field of study.",
      link: "/courses", // Example redirect URL
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
            {/* Use Link to handle the redirection */}
            <Link
              to={card.link}
              className="bg-purple-500 text-white py-2 px-4 rounded-lg inline-block"
            >
              View More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
