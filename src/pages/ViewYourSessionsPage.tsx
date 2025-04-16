import React, { useEffect, useState } from "react";
import SessionCard from "../components/SessionCard";
import SectionHeader from "../components/SectionHeader";
import { LoaderCircle } from "lucide-react";

interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  course?: string;
  tags?: string[];
  privacy: "private" | "public";
  isRequested?: boolean;
  creatorId?: string;
}

interface GroupResponse {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  privacy: boolean;
  creator: string;
  course?: string | { courseCode: string; title: string };
  tags?: string[];
  modality?: string;
}

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  if (!hours || !minutes) return time;
  let hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  hourNum = hourNum % 12 || 12;
  return `${hourNum}:${minutes} ${ampm}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const ViewYourSessionsPage: React.FC = () => {
  const [createdSessions, setCreatedSessions] = useState<Session[]>([]);
  const [joinedSessions, setJoinedSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem("userId");

  const handleLeaveSession = async (groupId: string) => {
    if (!userId) return;

    try {
      await fetch("http://www.scholarknights.com/api/leave-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId }),
      });

      setJoinedSessions((prev) => prev.filter((s) => s.id !== groupId));
    } catch (err) {
      console.error("Error leaving session:", err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await fetch(`http://www.scholarknights.com/api/groups/${groupId}`, {
        method: "DELETE",
      });

      setCreatedSessions((prev) => prev.filter((s) => s.id !== groupId));
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  useEffect(() => {
    const fetchUserSessions = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const response = await fetch(
          `http://www.scholarknights.com/api/user/groups/${userId}`
        );
        const data = await response.json();

        const created = data.createdGroups || [];
        const joined = data.joinedGroups || [];

        const formatSession = (group: GroupResponse): Session => ({
          id: group._id,
          title: group.title,
          description: group.description || "No description provided",
          date: formatDate(group.date),
          time: formatTime(group.time),
          location: group.location,
          mode: group.modality || (group.privacy ? "Online" : "In-person"),
          privacy: group.privacy ? "private" : "public",
          course:
            typeof group.course === "object"
              ? group.course.courseCode
              : group.course || "",
          tags: group.tags || [],
          creatorId: group.creator,
        });

        setCreatedSessions(created.map(formatSession));
        setJoinedSessions(joined.map(formatSession));
      } catch (err) {
        console.error("Error fetching user's sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserSessions();
    }
  }, [userId]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Sessions</h1>

      {!userId ? (
        <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg text-center font-medium max-w-xl mx-auto">
          Please log in to view your study sessions.
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center gap-2 text-gray-500">
          <LoaderCircle className="animate-spin" />
          <span>Loading your sessions...</span>
        </div>
      ) : (
        <>
          <SessionSection
            title="Your Created Sessions"
            sessions={createdSessions}
            emptyMessage="You haven't created any sessions yet."
            userId={userId}
            onDelete={handleDeleteGroup}
          />
          <div className="my-8" />
          <SessionSection
            title="Your Joined Sessions"
            sessions={joinedSessions}
            emptyMessage="You're not joined in any sessions yet."
            userId={userId}
            onLeave={handleLeaveSession}
          />
        </>
      )}
    </div>
  );
};

interface SessionSectionProps {
  title: string;
  sessions: Session[];
  emptyMessage: string;
  userId: string | null;
  onLeave?: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
}

const SessionSection: React.FC<SessionSectionProps> = ({
  title,
  sessions,
  emptyMessage,
  userId,
  onLeave,
  onDelete,
}) => {
  return (
    <section>
      <SectionHeader title={title} />
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onLeave={onLeave}
              onDelete={
                session.creatorId === userId && onDelete
                  ? () => onDelete(session.id)
                  : undefined
              }
              joinedSessionIds={[]} // Not used here
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{emptyMessage}</p>
      )}
    </section>
  );
};

export default ViewYourSessionsPage;
