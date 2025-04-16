import { Link } from "react-router-dom";
import { Lock, Globe, Trash } from "lucide-react";

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

interface SessionCardProps {
  session: Session;
  onJoin?: (groupId: string, privacy: "private" | "public") => void;
  onLeave?: (groupId: string) => void;
  onDelete?: () => void;
  joinedSessionIds?: string[];
  requestedSessionIds?: string[];
  hideJoin?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onJoin,
  onLeave,
  onDelete,
  joinedSessionIds = [],
  hideJoin = false,
}) => {
  const isJoined = joinedSessionIds.includes(session.id);
  const isRequested = session.isRequested === true;
  const isPrivate = session.privacy === "private";

  const handleJoin = () => {
    if (!onJoin || isJoined || isRequested || !session.privacy) return;
    onJoin(session.id, session.privacy);
  };

  const handleLeave = () => {
    if (
      onLeave &&
      window.confirm("Are you sure you want to leave this session?")
    ) {
      onLeave(session.id);
    }
  };

  const handleDelete = () => {
    if (
      onDelete &&
      window.confirm("Are you sure you want to delete this session?")
    ) {
      onDelete();
    }
  };

  const joinText = isJoined
    ? "Joined"
    : isRequested
    ? "Requested"
    : isPrivate
    ? "Request"
    : "Join";

  const isButtonDisabled = isJoined || isRequested;

  return (
    <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-bold mb-2">{session.title}</h2>

        {session.description && (
          <p className="text-gray-600 mb-2 line-clamp-3">
            {session.description}
          </p>
        )}

        {session.course && (
          <p className="text-sm text-indigo-700 font-semibold mb-1 uppercase tracking-wide">
            {typeof session.course === "string"
              ? session.course
              : session.course.courseCode}
          </p>
        )}

        {session.date && (
          <p className="text-sm text-gray-500 mb-1">
            {session.date} at {session.time}
          </p>
        )}

        {session.mode && (
          <p className="text-sm text-gray-500 mb-1">
            Modality: {session.mode} |{" "}
            {isPrivate
              ? "Location: Visible upon joining"
              : `Location: ${session.location}`}
          </p>
        )}

        {session.privacy && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-2">Privacy:</span>
            {isPrivate ? (
              <span className="flex items-center text-red-600 font-medium">
                <Lock className="w-4 h-4 mr-1" /> Private
              </span>
            ) : (
              <span className="flex items-center text-green-600 font-medium">
                <Globe className="w-4 h-4 mr-1" /> Public
              </span>
            )}
          </div>
        )}

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {session.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-violet-100 text-violet-800 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Link
          to={`/sessions/${session.id}`}
          className="text-violet-500 hover:text-violet-600 text-sm font-medium"
        >
          View Details →
        </Link>

        {!hideJoin &&
          (onDelete ? (
            <button
              onClick={handleDelete}
              className="flex items-center bg-red-500 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:opacity-90 hover:scale-105 transition"
            >
              <Trash className="w-4 h-4 mr-1" />
              Delete
            </button>
          ) : onLeave ? (
            <button
              onClick={handleLeave}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:opacity-90 hover:scale-105 transition transform"
            >
              Leave Session
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isButtonDisabled}
              className={`text-white text-sm font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 transition transform ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 hover:scale-105"
              }`}
            >
              {joinText}
            </button>
          ))}
      </div>
    </div>
  );
};

export default SessionCard;
