import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Lock,
  Tag,
  BookOpen,
  Pencil,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

type Course = {
  _id: string;
  courseCode: string;
  title: string;
};

type SessionType = {
  title: string;
  course: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  privacy: boolean;
  tags: string[];
  modality: string;
  description: string;
};

const CreateSession: React.FC = () => {
  const [session, setSession] = useState<SessionType>({
    title: "",
    course: "",
    date: "",
    time: "",
    location: "",
    capacity: 0,
    privacy: false,
    tags: [],
    modality: "",
    description: "",
  });

  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [notLoggedInMessage, setNotLoggedInMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://www.scholarknights.com/api/user/${userId}/courses`
        );
        setUserCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch user courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value, type } = e.target;
    let updatedValue: string | number | boolean = value;

    if (type === "number") {
      updatedValue = parseInt(value, 10);
    }

    if (name === "privacy") {
      updatedValue = value === "private";
    }

    setSession((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setNotLoggedInMessage("");

    const dateTime = new Date(`${session.date}T${session.time}`);
    const creator = localStorage.getItem("userId");

    if (!creator) {
      setNotLoggedInMessage("You must be logged in to create a session.");
      return;
    }

    try {
      const payload = {
        ...session,
        date: dateTime.toISOString(),
        members: [creator],
        creator,
      };

      const response = await axios.post(
        "http://www.scholarknights.com/api/addgroup",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Session created successfully!");
        setSession({
          title: "",
          course: "",
          date: "",
          time: "",
          location: "",
          capacity: 0,
          privacy: false,
          tags: [],
          modality: "",
          description: "",
        });
      }
    } catch (error: any) {
      console.error("Error submitting session:", error);
      const msg =
        error.response?.data?.message ||
        "An error occurred while creating the session.";
      alert(`Failed to create session: ${msg}`);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center py-10 overflow-y-auto">
      <div className="w-full max-w-lg bg-gray-200 shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Pencil className="w-6 h-6" /> Create Study Session
        </h2>

        {/* 🔔 Error Message if Not Logged In */}
        {notLoggedInMessage && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span>{notLoggedInMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Group Title"
            name="title"
            value={session.title}
            onChange={handleChange}
            icon={<BookOpen className="w-4 h-4 mr-1 text-gray-500" />}
          />

          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <BookOpen className="w-4 h-4" /> Course
            </label>
            <select
              name="course"
              value={session.course}
              onChange={handleChange}
              className="w-full pt-2 pb-2 outline-none"
              required
            >
              <option value="">Select a course</option>
              {userCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseCode} – {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Date"
              name="date"
              type="date"
              value={session.date}
              onChange={handleChange}
              icon={<CalendarDays className="w-4 h-4 mr-1 text-gray-500" />}
            />
            <InputField
              label="Time"
              name="time"
              type="time"
              value={session.time}
              onChange={handleChange}
              icon={<Clock className="w-4 h-4 mr-1 text-gray-500" />}
            />
          </div>

          <InputField
            label="Location"
            name="location"
            value={session.location}
            onChange={handleChange}
            icon={<MapPin className="w-4 h-4 mr-1 text-gray-500" />}
          />

          <InputField
            label="Capacity"
            name="capacity"
            type="number"
            value={session.capacity}
            onChange={handleChange}
            icon={<Users className="w-4 h-4 mr-1 text-gray-500" />}
          />

          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-1"
            >
              <Tag className="w-4 h-4" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={session.description}
              onChange={handleChange}
              placeholder="Write a short description about this session..."
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-violet-400 resize-none text-sm"
              required
            />
          </div>

          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <Tag className="w-4 h-4" /> Modality
            </label>
            <select
              name="modality"
              value={session.modality}
              onChange={handleChange}
              className="w-full pt-2 pb-2 outline-none"
              required
            >
              <option value="">Select modality</option>
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <Lock className="w-4 h-4" /> Privacy
            </label>
            <select
              name="privacy"
              value={session.privacy ? "private" : "public"}
              onChange={handleChange}
              className="w-full pt-2 pb-2 outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="relative bg-white p-3 rounded-lg shadow-sm">
            <label className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-1">
              <Tag className="w-4 h-4" /> Tag
            </label>
            <select
              name="tags"
              value={session.tags[0] || ""}
              onChange={(e) =>
                setSession((prev) => ({
                  ...prev,
                  tags: [e.target.value],
                }))
              }
              className="w-full pt-2 pb-2 outline-none"
            >
              <option value="">Select a tag</option>
              <option value="Group Study">Group Study</option>
              <option value="Exam Review">Exam Review</option>
              <option value="Homework Help">Homework Help</option>
              <option value="1-on-1 Help">1-on-1 Help</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Create Session
          </button>

          {successMessage && (
            <div className="flex items-center justify-center gap-2 mt-2 text-green-600 text-sm font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

type InputFieldProps = {
  label: string;
  name: keyof SessionType | string;
  value: string | number;
  type?: string;
  maxLength?: number;
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  type = "text",
  maxLength,
  icon,
  onChange,
}) => (
  <div className="relative bg-white p-3 rounded-lg shadow-sm">
    <label className="text-sm font-semibold text-gray-500 flex items-center gap-1 mb-1">
      {icon}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="w-full pt-2 pb-2 outline-none"
      required
    />
  </div>
);

export default CreateSession;
