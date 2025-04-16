import React from "react";
import SessionCard from "./SessionCard";

interface Session {
  id: string;
  title: string;
  description: string;
  date?: string;
  time?: string;
  mode?: string;
  location?: string;
  course?: string | { courseCode: string; title: string };
  tags?: string[];
  privacy?: "private" | "public";
  isRequested?: boolean;
}

interface SessionListProps {
  sessions: Session[];
  onJoin?: (groupId: string, privacy: "private" | "public") => void;
  onLeave?: (groupId: string) => void;
  onDelete?: () => void;
  joinedSessionIds?: string[];
  requestedSessionIds?: string[];
  hideJoin?: boolean;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onJoin,
  onLeave,
  onDelete,
  joinedSessionIds = [],
  requestedSessionIds = [],
  hideJoin = false,
}) => {
  if (sessions.length === 0) {
    return (
      <p className="text-gray-600">No study sessions match your filters.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onJoin={
            onJoin && session.privacy !== undefined
              ? () =>
                  onJoin(session.id, session.privacy as "private" | "public")
              : undefined
          }
          onLeave={onLeave}
          onDelete={onDelete}
          joinedSessionIds={joinedSessionIds}
          requestedSessionIds={requestedSessionIds}
          hideJoin={hideJoin}
        />
      ))}
    </div>
  );
};

export default SessionList;
