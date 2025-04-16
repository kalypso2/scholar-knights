import { useState, ChangeEvent } from "react";
import { Session } from "../types";

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

const defaultFilters: Filters = {
  search: "",
  privacy: [],
  mode: [],
  relevantOnly: false,
  date: "",
  startTime: "",
  endTime: "",
  courses: [],
  tags: [],
};

const useSessionFilters = (sessions: Session[], userCourses: string[] = []) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const clearFilters = () => setFilters(defaultFilters);

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFilters((prev) => {
      if (name === "relevantOnly") {
        return {
          ...prev,
          relevantOnly: checked,
          courses: checked ? [] : prev.courses,
        };
      }

      if (type === "checkbox") {
        const isArrayFilter = ["privacy", "mode", "courses", "tags"].includes(
          name
        );
        if (isArrayFilter) {
          return {
            ...prev,
            [name]: checked
              ? [...(prev[name as keyof Filters] as string[]), value]
              : (prev[name as keyof Filters] as string[]).filter(
                  (v) => v !== value
                ),
          };
        }
      }

      return { ...prev, [name]: value };
    });
  };

  const convertToMinutes = (time: string): number => {
    if (!time || typeof time !== "string") return -1;

    const isPM = time.toLowerCase().includes("pm");
    const isAM = time.toLowerCase().includes("am");

    const cleanedTime = time.replace(/am|pm/gi, "").trim();
    const [rawHours, rawMinutes] = cleanedTime.split(":");
    let hour = parseInt(rawHours, 10);
    const minutes = parseInt(rawMinutes, 10);

    if (isNaN(hour) || isNaN(minutes)) return -1;

    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;

    return hour * 60 + minutes;
  };

  const formatToDateOnly = (dateString: string): string => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesPrivacy =
      filters.privacy.length === 0 || filters.privacy.includes(session.privacy);

    const matchesMode =
      filters.mode.length === 0 ||
      (session.mode && filters.mode.includes(session.mode.toLowerCase()));

    const matchesDate =
      !filters.date || formatToDateOnly(session.date || "") === filters.date;

    const sessionCourseCode =
      typeof session.course === "string"
        ? session.course
        : session.course?.courseCode;

    const matchesCourse = filters.relevantOnly
      ? sessionCourseCode && userCourses.includes(sessionCourseCode)
      : filters.courses.length === 0 ||
        (sessionCourseCode && filters.courses.includes(sessionCourseCode));

    const startMinutes = filters.startTime
      ? convertToMinutes(filters.startTime)
      : null;

    const endMinutes = filters.endTime
      ? convertToMinutes(filters.endTime)
      : null;

    const sessionMinutes = convertToMinutes(session.time || "");

    const matchesTime =
      sessionMinutes !== -1 &&
      (startMinutes === null || sessionMinutes >= startMinutes) &&
      (endMinutes === null || sessionMinutes <= endMinutes);

    const matchesTags =
      filters.tags.length === 0 ||
      (session.tags?.some((tag) => filters.tags.includes(tag)) ?? false);

    return (
      matchesSearch &&
      matchesPrivacy &&
      matchesMode &&
      matchesDate &&
      matchesTime &&
      matchesCourse &&
      matchesTags
    );
  });

  return { filters, handleFilterChange, filteredSessions, clearFilters };
};

export default useSessionFilters;
