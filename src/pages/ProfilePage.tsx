import React, { useState, useEffect, ChangeEvent } from "react";
import { User, Edit3, Save, BookOpen, Info } from "lucide-react";
import axios from "axios";

interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  description: string;
  courses: string[];
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(
          `http://www.scholarknights.com/api/fetch-profile/${userId}`
        );

        const user = profileRes.data?.user;
        const coursesRes = await axios.get(
          `http://www.scholarknights.com/api/user/${userId}/courses`
        );

        const courseCodes = Array.isArray(coursesRes.data?.courses)
          ? coursesRes.data.courses.map((c: any) => c.courseCode || c)
          : [];

        const loadedProfile: Profile = {
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          username: user.username || "",
          description: user.description || "",
          courses: courseCodes,
        };

        setProfile(loadedProfile);
        setForm(loadedProfile);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!form) return;
    setForm((prev) => ({ ...prev!, [name]: value }));
  };

  const saveProfile = async () => {
    if (!userId || !form || !profile) return;

    try {
      const requests = [];

      if (form.username !== profile.username) {
        requests.push(
          axios.post(
            `http://www.scholarknights.com/api/update-username/${userId}`,
            { newUserName: form.username }
          )
        );
      }

      if (form.description !== profile.description) {
        requests.push(
          axios.post(
            `http://www.scholarknights.com/api/update-description/${userId}`,
            { newDescription: form.description }
          )
        );
      }

      if (form.firstName !== profile.firstName) {
        requests.push(
          axios.post(
            `http://www.scholarknights.com/api/update-first-name/${userId}`,
            { first_name: form.firstName }
          )
        );
      }

      if (form.lastName !== profile.lastName) {
        requests.push(
          axios.post(
            `http://www.scholarknights.com/api/update-last-name/${userId}`,
            { last_name: form.lastName }
          )
        );
      }

      await Promise.all(requests);
      setProfile(form);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to update profile");
    }
  };

  if (!profile || !form) {
    return (
      <div className="text-center text-gray-500 mt-10">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="bg-white max-w-3xl mx-auto p-8 rounded-3xl shadow-xl border border-purple-100">
        <h1 className="text-4xl font-extrabold mb-8 text-purple-700 flex items-center gap-3">
          <User size={32} /> Profile Overview
        </h1>

        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Info size={16} /> Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="text-right">
              <button
                onClick={saveProfile}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 ml-auto"
              >
                <Save size={18} /> Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="font-semibold text-gray-700">Name:</p>
              <p className="text-gray-800">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Username:</p>
              <p className="text-gray-800">{profile.username}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Description:</p>
              <p className="text-gray-800">
                {profile.description || "(No description yet)"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-700 flex items-center gap-2 text-lg mb-2">
                <BookOpen size={20} /> Courses You're Taking:
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.courses.length > 0 ? (
                  profile.courses.map((course, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {course}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No courses added yet.</p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                To edit courses, visit the Courses tab.
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
