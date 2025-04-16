import React from "react";
import { Trash2 } from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
}

interface CourseCardProps {
  course: Course;
  onDelete: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = React.memo(
  ({ course, onDelete }) => {
    const handleDelete = () => {
      onDelete(course.id);
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">
            {course.name}
          </h2>
          <p className="text-gray-600 mb-4">Course Code: {course.code}</p>
        </div>

        <div className="flex justify-end mt-auto">
          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 hover:opacity-90 hover:scale-105 transition transform"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    );
  }
);

export default CourseCard;
