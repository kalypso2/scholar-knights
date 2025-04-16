import React, { ChangeEvent } from "react";

interface Filters {
  search: string;
  privacy: string[];
  mode: string[];
  relevantOnly: boolean;
  date: string;
  startTime: string;
  endTime: string;
  courses: string[];
  tags: string[];
}

interface Course {
  courseCode: string;
  title: string;
}

interface FiltersSidebarProps {
  filters: Filters;
  handleFilterChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  userCourses: Course[];
  clearFilters: () => void; // ✅ added
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  filters,
  handleFilterChange,
  userCourses,
  clearFilters, // ✅ used
}) => {
  const handleCourseChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && filters.relevantOnly) {
      handleFilterChange({
        ...e,
        target: { ...e.target, name: "relevantOnly", checked: false },
      });
    }
    handleFilterChange(e);
  };

  const handleRelevantOnlyChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && filters.courses.length > 0) {
      userCourses.forEach((course) => {
        handleFilterChange({
          ...e,
          target: {
            ...e.target,
            name: "courses",
            value: course.courseCode,
            type: "checkbox",
            checked: false,
          },
        });
      });
    }
    handleFilterChange(e);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Filters</h3>
        <input
          type="text"
          placeholder="Search For Sessions"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md shadow-sm border border-gray-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Privacy</label>
        <div className="space-y-2">
          {["private", "public"].map((val) => (
            <label key={val} className="flex items-center">
              <input
                type="checkbox"
                name="privacy"
                value={val}
                checked={filters.privacy.includes(val)}
                onChange={handleFilterChange}
              />
              <span className="ml-2 capitalize">{val}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Mode</label>
        <div className="space-y-2">
          {["online", "in-person"].map((val) => (
            <label key={val} className="flex items-center">
              <input
                type="checkbox"
                name="mode"
                value={val}
                checked={filters.mode.includes(val)}
                onChange={handleFilterChange}
              />
              <span className="ml-2 capitalize">{val}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md shadow-sm border border-gray-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Time Range</label>
        <div className="flex gap-2">
          <input
            type="time"
            name="startTime"
            value={filters.startTime}
            onChange={handleFilterChange}
            className="w-1/2 p-3 rounded-md shadow-sm border border-gray-300"
          />
          <input
            type="time"
            name="endTime"
            value={filters.endTime}
            onChange={handleFilterChange}
            className="w-1/2 p-3 rounded-md shadow-sm border border-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Courses</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="relevantOnly"
              checked={filters.relevantOnly}
              onChange={handleRelevantOnlyChange}
            />
            <span className="ml-2">Show only relevant study sessions</span>
          </label>
          {userCourses.map((course) => (
            <label key={course.courseCode} className="flex items-center">
              <input
                type="checkbox"
                name="courses"
                value={course.courseCode}
                checked={filters.courses.includes(course.courseCode)}
                onChange={handleCourseChange}
              />
              <span className="ml-2">{course.courseCode}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Tags</label>
        <div className="space-y-2">
          {["Group Study", "Exam Review", "Homework Help", "1-on-1 Help"].map(
            (tag) => (
              <label key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  checked={filters.tags.includes(tag)}
                  onChange={handleFilterChange}
                />
                <span className="ml-2">{tag}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* ✅ Clear Filters Button */}
      <div className="pt-4">
        <button
          type="button"
          className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded"
          onClick={clearFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
