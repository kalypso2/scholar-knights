import React, { useState } from "react";

type SessionType = {
  groupName: string;
  courseName: string;
  date: string;
  time: string;
  location: string;
  mode: "in-person" | "online";
  link: string;
  privacy: "public" | "private";
  description: string;
};

const CreateSession: React.FC = () => {
  const [session, setSession] = useState<SessionType>({
    groupName: "",
    courseName: "",
    date: "",
    time: "",
    location: "",
    mode: "in-person",
    link: "",
    privacy: "public",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setSession({ ...session, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Session Data:", session);
    // Send session data to backend here
  };

  return (
    <div className="bg-gray-100 flex justify-center py-10 overflow-y-auto">
      <div className="w-full max-w-lg bg-gray-200 shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Create Study Session
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Study Group Name */}
          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
              Study Group Name
            </label>
            <input
              type="text"
              name="groupName"
              value={session.groupName}
              onChange={handleChange}
              className="w-full pt-5 pb-2 outline-none"
              required
            />
          </div>

          {/* Course Name */}
          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
              Course Name
            </label>
            <input
              type="text"
              name="courseName"
              value={session.courseName}
              onChange={handleChange}
              className="w-full pt-5 pb-2 outline-none"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative bg-white p-3 rounded-lg shadow-sm">
              <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={session.date}
                onChange={handleChange}
                className="w-full pt-5 pb-2 outline-none"
                required
              />
            </div>
            <div className="relative bg-white p-3 rounded-lg shadow-sm">
              <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={session.time}
                onChange={handleChange}
                className="w-full pt-5 pb-2 outline-none"
                required
              />
            </div>
          </div>

          {/* Mode */}
          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
              Mode
            </label>
            <select
              name="mode"
              value={session.mode}
              onChange={handleChange}
              className="w-full pt-5 pb-2 outline-none"
              required
            >
              <option value="in-person">In-Person</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Location (if in-person) */}
          {session.mode === "in-person" && (
            <div className="relative bg-white p-3 rounded-lg shadow-sm">
              <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={session.location}
                onChange={handleChange}
                className="w-full pt-5 pb-2 outline-none"
              />
            </div>
          )}

          {/* Online Link (if online) */}
          {session.mode === "online" && (
            <div className="relative bg-white p-3 rounded-lg shadow-sm">
              <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
                Meeting Link
              </label>
              <input
                type="url"
                name="link"
                value={session.link}
                onChange={handleChange}
                className="w-full pt-5 pb-2 outline-none"
              />
            </div>
          )}

          {/* Privacy */}
          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
              Privacy
            </label>
            <select
              name="privacy"
              value={session.privacy}
              onChange={handleChange}
              className="w-full pt-5 pb-2 outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Description */}
          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 absolute top-1 left-3">
              Description
            </label>
            <textarea
              name="description"
              value={session.description}
              onChange={handleChange}
              className="w-full pt-5 pb-2 outline-none"
              rows={3}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Create Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSession;
