import React from "react";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
      {title}
    </h2>
  );
};

export default SectionHeader;
