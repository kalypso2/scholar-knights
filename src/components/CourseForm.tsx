import React, { useState, useEffect } from "react";

interface CourseFormProps {
  newCourseName: string;
  setNewCourseName: (name: string) => void;
  newCourseCode: string;
  setNewCourseCode: (code: string) => void;
  handleAddCourse: (e: React.FormEvent<HTMLFormElement>) => void;
  setSelectedCourseId: (id: string | null) => void;
}

const CourseForm: React.FC<CourseFormProps> = React.memo(
  ({
    newCourseName,
    setNewCourseName,
    newCourseCode: _newCourseCode,
    setNewCourseCode,
    handleAddCourse,
    setSelectedCourseId,
  }) => {
    const [courseSubject, setCourseSubject] = useState("");
    const [courseNumber, setCourseNumber] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
      const fullCode = `${courseSubject}${courseNumber}`.toUpperCase();
      setNewCourseCode(fullCode);
    }, [courseSubject, courseNumber, setNewCourseCode]);

    useEffect(() => {
      const fullCode = `${courseSubject}${courseNumber}`.toUpperCase();
      if (fullCode.length >= 3) {
        fetch(`http://www.scholarknights.com/api/courses/code/${fullCode}`)
          .then((res) => {
            if (!res.ok) throw new Error("No matches");
            return res.json();
          })
          .then((data) => {
            const results = Array.isArray(data) ? data : [data];
            setSuggestions(results);
            setDropdownVisible(results.length > 0);
          })
          .catch(() => {
            setSuggestions([]);
            setDropdownVisible(false);
          });
      } else {
        setSuggestions([]);
        setDropdownVisible(false);
      }
    }, [courseSubject, courseNumber]);

    const handleSelectCourse = (course: any) => {
      setDropdownVisible(false);
      setSuggestions([]);

      setCourseSubject(course.courseCode.slice(0, 3));
      setCourseNumber(course.courseCode.slice(3));
      setNewCourseName(course.title);
      setSelectedCourseId(course._id);
    };

    useEffect(() => {
      if (newCourseName === "") {
        setCourseSubject("");
        setCourseNumber("");
        setSelectedCourseId(null);
      }
    }, [newCourseName]);

    return (
      <div className="flex justify-center py-10">
        <div className="w-full max-w-lg bg-gray-200 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Add a Course</h2>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="relative bg-white p-3 rounded-lg shadow-sm">
                <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
                  Course Code Letters
                </label>
                <input
                  type="text"
                  value={courseSubject}
                  onChange={(e) =>
                    setCourseSubject(e.target.value.toUpperCase())
                  }
                  className="w-full pt-5 pb-2 outline-none uppercase"
                  placeholder="e.g. CSE"
                  maxLength={3}
                  required
                />
              </div>

              <div className="relative bg-white p-3 rounded-lg shadow-sm">
                <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
                  Course Code (e.g. 2049 or 2049L)
                </label>
                <input
                  type="text"
                  value={courseNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    if (/^\d{0,4}[A-Z]?$/.test(value)) {
                      setCourseNumber(value);
                    }
                  }}
                  className="w-full pt-5 pb-2 outline-none"
                  placeholder="e.g. 2049 or 2049L"
                  maxLength={5}
                  required
                />
              </div>

              {dropdownVisible && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 col-span-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto z-20">
                  {suggestions.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => handleSelectCourse(course)}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {course.courseCode} – {course.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Name Display (Read-Only) */}
            <div className="relative bg-white p-3 rounded-lg shadow-sm">
              <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
                Course Name
              </label>
              <input
                type="text"
                value={newCourseName}
                readOnly
                className="w-full pt-5 pb-2 outline-none cursor-not-allowed"
                placeholder="Course name will auto-fill"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add Course
            </button>
          </form>
        </div>
      </div>
    );
  }
);

export default CourseForm;
