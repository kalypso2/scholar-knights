const StudySession = () => {
  return (
    <div className="flex items-center justify-center h-[90vh] bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl h-full">
        {/* Attendee List */}
        <div className="bg-white shadow-lg rounded-xl w-full flex flex-col">
          <div className="rounded-t-lg text-black text-center py-3 text-2xl font-semibold w-full border-b border-black">
            List of Attendees
          </div>
          <div className="p-4 text-gray-700 text-lg w-full flex-grow rounded-b-xl">
            {/* Content goes here */}
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white shadow-lg rounded-xl w-full flex flex-col items-center">
          <div className="rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 text-2xl font-semibold w-full">
            Kelly’s Midterm Review
          </div>
          <div className="p-4 text-gray-700 text-lg w-full flex-grow rounded-b-xl">
            <p>
              <strong>Description:</strong> Study session to review for AI class
              midterm
            </p>
            <p className="mt-3">
              <strong>Notes:</strong> (Discord link), bring a paper and pencil
              for practice exam
            </p>
            <p className="mt-3">
              <strong>Location:</strong> John C. Hitt Library, 3rd floor, room
              338
            </p>
            <p className="text-blue-500 underline cursor-pointer mt-2">
              View map
            </p>
          </div>
          <div className="pb-4">
            <button className="bg-purple-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-purple-600 transition">
              RSVP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
