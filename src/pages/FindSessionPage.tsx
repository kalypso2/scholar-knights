import React, { useEffect, useState } from "react";
import FiltersSidebar from "../components/FiltersSidebar";
import SessionList from "../components/SessionList";
import useSessionFilters from "../hooks/useSessionFilters";
import Pagination from "../components/Pagination";
import { Session } from "../types";
import axios from "axios";

interface GroupFromAPI {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  privacy: boolean;
  creator: string;
  modality?: "Online" | "In-person";
  course?:
    | {
        _id: string;
        courseCode: string;
        title: string;
      }
    | string;
  tags?: string[];
  joinRequests?: string[];
}

const formatTime = (time: string): string => {
  if (!time || typeof time !== "string" || !time.includes(":"))
    return "Time TBD";
  const [hours, minutes] = time.split(":");
  let hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  hourNum = hourNum % 12 || 12;
  return `${hourNum}:${minutes} ${ampm}`;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "Date TBD";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const FindSessionPage: React.FC = () => {
  const [sessionsData, setSessionsData] = useState<Session[]>([]);
  const [userCourseCodes, setUserCourseCodes] = useState<string[]>([]);
  const [joinedSessionIds, setJoinedSessionIds] = useState<string[]>([]);
  const [requestedSessionIds, setRequestedSessionIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loginPromptVisible, setLoginPromptVisible] = useState(false);
  const itemsPerPage = 9;

  const userId = localStorage.getItem("userId");

  const { filters, handleFilterChange, filteredSessions, clearFilters } =
    useSessionFilters(sessionsData, userCourseCodes);

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showLoginPrompt = () => {
    setLoginPromptVisible(true);
    setTimeout(() => setLoginPromptVisible(false), 6000);
  };

  const handleJoinSession = async (
    groupId: string,
    privacy: "public" | "private"
  ) => {
    if (!userId) return showLoginPrompt();

    if (privacy === "private") {
      try {
        await axios.post(
          `http://www.scholarknights.com/api/groups/${groupId}/request-join`,
          { userId },
          { withCredentials: true }
        );

        setRequestedSessionIds((prev) => [...prev, groupId]);
        setSessionsData((prev) =>
          prev.map((session) =>
            session.id === groupId ? { ...session, isRequested: true } : session
          )
        );
      } catch (err: any) {
        const alreadySent =
          err.response?.data?.message === "Join request already sent";
        if (alreadySent) {
          setRequestedSessionIds((prev) => [...prev, groupId]);
          setSessionsData((prev) =>
            prev.map((session) =>
              session.id === groupId
                ? { ...session, isRequested: true }
                : session
            )
          );
        }
        console.error("Private group join request failed:", err);
      }
      return;
    }

    try {
      await axios.post(
        "http://www.scholarknights.com/api/join-group",
        { userId, groupId },
        { withCredentials: true }
      );
      setJoinedSessionIds((prev) => [...prev, groupId]);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to join session.";
      alert(message);
      console.error("Join error:", err);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://www.scholarknights.com/api/groups",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const groups: GroupFromAPI[] = res.data.groups;

        const sessions: Session[] = groups
          .filter((group) => group.creator !== userId && group.course)
          .map((group) => ({
            id: group._id,
            title: group.title,
            description: group.description || "",
            date: formatDate(group.date),
            time: formatTime(group.time),
            location: group.location,
            mode: group.modality || (group.privacy ? "Online" : "In-person"),
            course:
              typeof group.course === "object"
                ? group.course.courseCode
                : typeof group.course === "string"
                ? group.course
                : "N/A",
            privacy: group.privacy ? "private" : "public",
            tags: group.tags || [],
            isRequested: group.joinRequests?.some(
              (id: string) => id.toString() === userId
            ),
          }));

        setSessionsData(sessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    const fetchUserCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://www.scholarknights.com/api/user/${userId}/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const courseCodes = res.data.courses.map((c: any) => c.courseCode);
        setUserCourseCodes(courseCodes);
      } catch (err) {
        console.error("Failed to load user courses:", err);
      }
    };

    const fetchUserGroups = async () => {
      try {
        if (!userId) return;
        const groupRes = await axios.get(
          `http://www.scholarknights.com/api/user/groups/${userId}`
        );
        const joinedIds = groupRes.data.joinedGroups.map((g: any) => g._id);
        setJoinedSessionIds(joinedIds);
      } catch (err) {
        console.error("Failed to fetch joined groups:", err);
      }
    };

    fetchGroups();
    fetchUserCourses();
    fetchUserGroups();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen relative">
      {loginPromptVisible && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-10 py-4 rounded-lg shadow-lg text-base font-semibold transition-opacity duration-1000">
          Please log in to join a session.
        </div>
      )}

      <div className="w-full lg:w-1/4 p-4">
        <div className="sticky top-6 bg-white shadow-md rounded-lg p-4 space-y-6">
          <FiltersSidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
            userCourses={userCourseCodes.map((code) => ({
              courseCode: code,
              title: "",
            }))}
            clearFilters={clearFilters}
          />
        </div>
      </div>

      <main className="flex-1 p-6">
        <SessionList
          sessions={paginatedSessions}
          onJoin={(id, privacy) => handleJoinSession(id, privacy)}
          joinedSessionIds={joinedSessionIds}
          requestedSessionIds={requestedSessionIds}
        />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default FindSessionPage;
