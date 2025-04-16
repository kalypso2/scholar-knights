import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons from Lucide

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = React.memo(
  ({ totalPages, currentPage, onPageChange }) => {
    return (
      <div className="flex items-center justify-center mt-6">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`mx-1 p-2 rounded-lg transition ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-blue-600"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Number Buttons */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`mx-1 px-4 py-2 rounded-lg transition ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black hover:bg-blue-600"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`mx-1 p-2 rounded-lg transition ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-blue-600"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }
);

export default Pagination;
