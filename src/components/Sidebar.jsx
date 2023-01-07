import React from "react";
import { HomeIcon, HashtagIcon, BellIcon, EnvelopeIcon, BookmarkIcon, UserIcon, EllipsisHorizontalCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Sidebar() {
  const appSignOut = () => {
    localStorage.setItem("authenticated", "false");
    signOut(auth);
  };
  return (
    <aside className="sticky top-0 sm:relative h-screen w-18 sm:w-0 col-span-1 sm:col-span-2 border border-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="#1ca0f2"
        className="w-12 h-12 mx-auto my-12"
      >
        <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
      </svg>
      <nav className="space-y-4">
        <div className="flex items-center px-4 space-x-2 cursor-pointer">
          <HomeIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">Home</h1>
        </div>
        <div className="flex items-center px-4 space-x-2 cursor-pointer">
          <HashtagIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">Explore</h1>
        </div>
        <div className="flex items-center px-4 space-x-2 cursor-pointer">
          <BellIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">
            Notifications
          </h1>
        </div>
        <div className="flex items-center px-4 space-x-2 cursor-pointer">
          <EnvelopeIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">Messages</h1>
        </div>
        <div className="flex items-center px-4 space-x-2 cursor-pointer">
          <BookmarkIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">
            Bookmarks
          </h1>
        </div>
        <div className="flex items-center px-4 space-x-2 cursor-pointer">
          <UserIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">Profile</h1>
        </div>
        <div className="flex items-center px-4 space-x-2 cursor-pointer">
          <EllipsisHorizontalCircleIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">More</h1>
        </div>
        <div
          onClick={appSignOut}
          className="flex px-4 items-center space-x-2 cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="w-12 h-12 text-[#1ca0f2]" />
          <h1 className="text-xl hidden sm:block hover:text-[#1ca0f2]">Logout</h1>
        </div>
      </nav>
    </aside>
  );
}
