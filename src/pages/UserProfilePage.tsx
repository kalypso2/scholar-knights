import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, BookOpen } from "lucide-react";
import axios from "axios";

interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  description: string;
  courses: string[];
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
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

        setProfile({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          username: user.username || "",
          description: user.description || "",
          courses: courseCodes,
        });
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) {
    return (
      <div className="text-center text-gray-500 mt-10">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="bg-white max-w-3xl mx-auto p-8 rounded-3xl shadow-xl border border-purple-100">
        <h1 className="text-4xl font-extrabold mb-8 text-purple-700 flex items-center gap-3">
          <User size={32} /> User Profile
        </h1>

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
              <BookOpen size={20} /> Courses:
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
                <p className="text-gray-500 text-sm">No courses added.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
