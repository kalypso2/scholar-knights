import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="flex items-center bg-gray-300 p-3 rounded-lg mb-6">
      <div className="flex-1" />
      <div className="flex items-center gap-4 w-1/3">
        <input
          type="text"
          placeholder="Search"
          className="p-2 rounded border border-gray-400 flex-grow"
        />
        <div className="w-10 h-10 bg-purple-500 rounded-lg text-white flex items-center justify-center font-bold cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 flex justify-end">
        <Link
          to="/LoginPage"
          className="w-10 h-10 bg-purple-500 rounded-full text-white flex items-center justify-center font-bold cursor-pointer"
        >
          T
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
