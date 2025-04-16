import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Lock,
  Globe,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";

interface Attendee {
  name: string;
  username: string;
  userId: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  mode: string;
  location: string;
  privacy: "public" | "private";
  attendees: Attendee[];
  pendingRequests: Attendee[];
  createdBy: string;
  tags?: string[];
}

const ViewSessionDetailsPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [requested, setRequested] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = {
    username: localStorage.getItem("username") || "",
    userId: localStorage.getItem("userId") || "",
  };

  const fetchSessionData = async () => {
    try {
      const res = await fetch(
        `http://www.scholarknights.com/api/groups/${sessionId}`
      );
      const data = await res.json();
      const group = data.group;

      const fetchProfile = async (userId: string) => {
        const res = await fetch(
          `http://www.scholarknights.com/api/fetch-profile/${userId}`
        );
        if (!res.ok) return null;
        const userData = await res.json();
        return userData.user;
      };

      const attendees: Attendee[] = await Promise.all(
        (group.members || []).map(async (member: any) => {
          const id = typeof member === "string" ? member : member._id;
          const profile = await fetchProfile(id);
          return {
            name:
              profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.username || "User",
            username: profile?.username || "unknown",
            userId: profile?._id || id,
          };
        })
      );

      const formatTime = (time: string): string => {
        const [hourStr, minuteStr] = time.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = minuteStr.padStart(2, "0");
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
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

      let pendingRequests: Attendee[] = [];
      if (group.creator === currentUser.userId && group.privacy) {
        const requestRes = await fetch(
          `http://www.scholarknights.com/api/groups/${group._id}/requests?userId=${currentUser.userId}`
        );
        const requestData = await requestRes.json();
        pendingRequests = await Promise.all(
          requestData.joinRequests.map(async (user: any) => ({
            name: `${user.first_name} ${user.last_name}`,
            username: user.username,
            userId: user._id,
          }))
        );
      }

      const isJoined = attendees.some((a) => a.userId === currentUser.userId);
      const isRequested = (group.joinRequests || []).some(
        (id: string) => id === currentUser.userId
      );

      setSession({
        id: group._id,
        title: group.title,
        description: group.description || "No description provided",
        date: formatDate(group.date),
        time: formatTime(group.time),
        mode: group.modality ?? "N/A",
        location: group.location,
        privacy: group.privacy ? "private" : "public",
        attendees,
        pendingRequests,
        createdBy: group.creator,
        tags: group.tags,
      });

      setJoined(isJoined);
      setRequested(isRequested);
    } catch (err) {
      console.error("Failed to fetch session:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const handleJoin = async () => {
    if (!session || submitting || joined || requested || !currentUser.userId)
      return;
    setSubmitting(true);

    try {
      if (session.privacy === "private") {
        await fetch(
          `http://www.scholarknights.com/api/groups/${session.id}/request-join`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUser.userId }),
          }
        );
        setRequested(true);
      } else {
        await fetch("http://www.scholarknights.com/api/join-group", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.userId,
            groupId: session.id,
          }),
        });
        setJoined(true);
      }
    } catch (err) {
      console.error("Join error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKick = async (userId: string) => {
    if (!session) return;
    try {
      await fetch("http://www.scholarknights.com/api/leave-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, groupId: session.id }),
      });
      fetchSessionData();
    } catch (err) {
      console.error("Kick error:", err);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!session) return;
    try {
      await fetch(
        `http://www.scholarknights.com/api/groups/${session.id}/approve-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, creatorId: currentUser.userId }),
        }
      );
      fetchSessionData();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleDeny = async (userId: string) => {
    if (!session) return;
    try {
      await fetch(
        `http://www.scholarknights.com/api/groups/${session.id}/deny-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, creatorId: currentUser.userId }),
        }
      );
      fetchSessionData();
    } catch (err) {
      console.error("Deny error:", err);
    }
  };

  if (loading || !session) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading session details...
      </div>
    );
  }

  const joinButtonText = joined
    ? "Joined"
    : requested
    ? "Requested"
    : session.privacy === "private"
    ? "Request"
    : "Join";

  const disableJoin = !currentUser.userId || joined || requested || submitting;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white rounded-xl p-6 shadow-md max-w-4xl mx-auto relative">
        <h1 className="text-3xl font-bold mb-4">{session.title}</h1>
        <p className="text-gray-700 mb-6">{session.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2 py-2 px-1">
            <CalendarDays size={18} />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{session.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span>
              {session.privacy === "private" &&
              !joined &&
              session.createdBy !== currentUser.userId
                ? "Location hidden until approved"
                : session.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>{session.mode}</span>
          </div>
          <div className="flex items-center gap-2">
            {session.privacy === "private" ? (
              <Lock size={18} />
            ) : (
              <Globe size={18} />
            )}
            <span className="capitalize">{session.privacy}</span>
          </div>
        </div>

        {Array.isArray(session.tags) && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {session.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-violet-100 text-violet-800 text-xs font-semibold px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowAttendees(!showAttendees)}
            className="text-purple-600 hover:underline text-sm flex items-center gap-1"
          >
            {showAttendees ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
            {showAttendees
              ? "Hide Attendees"
              : `Show Attendees (${session.attendees.length})`}
          </button>
          {showAttendees && (
            <ul className="mt-2 text-gray-700 max-h-48 overflow-y-auto pr-2">
              {session.attendees.map((attendee, index) => (
                <li key={index} className="flex items-center gap-3 p-2">
                  <Link
                    to={`/profile/${attendee.userId}`}
                    className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm hover:opacity-90"
                    title={`View ${attendee.name}'s profile`}
                  >
                    {attendee.name.charAt(0)}
                  </Link>
                  <span>{attendee.name}</span>
                  {session.createdBy === currentUser.userId &&
                    attendee.userId !== currentUser.userId && (
                      <button
                        onClick={() => handleKick(attendee.userId)}
                        className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md hover:opacity-90 hover:scale-105 transition"
                      >
                        <Trash2 size={14} />
                        Kick
                      </button>
                    )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {session.createdBy === currentUser.userId &&
          session.privacy === "private" &&
          session.pendingRequests.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700">
                Pending Join Requests:
              </h3>
              {session.pendingRequests.map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-white rounded shadow-sm mb-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500">
                      @{user.username}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(user.userId)}
                      className="px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeny(user.userId)}
                      className="px-3 py-1 text-xs font-semibold bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        {session.createdBy !== currentUser.userId && (
          <div className="absolute bottom-4 right-6">
            <button
              onClick={handleJoin}
              disabled={disableJoin}
              className={`text-white text-sm font-semibold px-4 py-2 rounded-md transition transform ${
                disableJoin
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 hover:scale-105"
              }`}
            >
              {joinButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSessionDetailsPage;
