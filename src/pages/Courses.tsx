import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";

const CourseCard = lazy(() => import("../components/CourseCard"));
const CourseForm = lazy(() => import("../components/CourseForm"));
const Pagination = lazy(() => import("../components/Pagination"));

interface Course {
  id: string;
  name: string;
  code: string;
}

const Courses: React.FC = () => {
  const coursesPerPage = 6;
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newCourseName, setNewCourseName] = useState<string>("");
  const [newCourseCode, setNewCourseCode] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `http://www.scholarknights.com/api/user/${userId}/courses`
        );
        const data = await response.json();

        if (data.courses) {
          const formattedCourses = data.courses.map((c: any) => ({
            id: c._id,
            name: c.title,
            code: c.courseCode,
          }));
          setCourses(formattedCourses);
          setTotalPages(Math.ceil(formattedCourses.length / coursesPerPage));
        }
      } catch (err) {
        console.error("Failed to fetch user's courses:", err);
      }
    };

    fetchUserCourses();
  }, [userId]);

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedCourseId) {
      setErrorMessage("Please select a valid course.");
      return;
    }

    if (!userId) {
      setErrorMessage("Please login to select a course.");
      return;
    }

    try {
      const addToUserRes = await fetch(
        `http://www.scholarknights.com/api/user/${userId}/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseCode: newCourseCode.trim().toUpperCase(),
            title: newCourseName.trim(),
          }),
        }
      );

      const updatedUserData = await addToUserRes.json();

      if (addToUserRes.ok) {
        const updatedCourses = updatedUserData.courses.map((c: any) => ({
          id: c._id,
          name: c.title,
          code: c.courseCode,
        }));

        setCourses(updatedCourses);
        setTotalPages(Math.ceil(updatedCourses.length / coursesPerPage));
        setNewCourseName("");
        setNewCourseCode("");
        setSelectedCourseId(null);
      } else {
        setErrorMessage("Failed to add course to user.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      setErrorMessage("Network error while adding course.");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://www.scholarknights.com/api/user/${userId}/courses/${courseId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const filtered = courses.filter((c) => c.id !== courseId);
        setCourses(filtered);
        setTotalPages(Math.ceil(filtered.length / coursesPerPage));
      } else {
        setErrorMessage("Failed to remove course.");
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
      setErrorMessage("Failed to delete course.");
    }
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;

  const currentCourses = useMemo(() => {
    return courses.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [courses, currentPage]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="py-10 px-6 max-w-6xl mx-auto rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Your Courses
      </h1>

      {errorMessage && (
        <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4 text-sm text-center font-medium">
          {errorMessage}
        </div>
      )}

      <Suspense fallback={<div>Loading form...</div>}>
        <CourseForm
          newCourseName={newCourseName}
          setNewCourseName={setNewCourseName}
          newCourseCode={newCourseCode}
          setNewCourseCode={setNewCourseCode}
          handleAddCourse={handleAddCourse}
          setSelectedCourseId={setSelectedCourseId}
        />
      </Suspense>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        <Suspense fallback={<div>Loading courses...</div>}>
          {currentCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={handleDeleteCourse}
            />
          ))}
        </Suspense>
      </div>

      <div className="mt-10">
        <Suspense fallback={<div>Loading pagination...</div>}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Courses;
