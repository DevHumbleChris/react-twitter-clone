import {
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  ArrowUpTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/20/solid";
import React from "react";

export default function Tweet({ tweet }) {
  return (
    <div className="border border-gray-300 p-2">
      <div className="flex space-x-2">
        <img
          src={tweet.user.photoURL}
          alt="user-logo"
          className="w-16 h-16 border border-gray-200 rounded-full"
        />
        <div>
          <h1>{tweet.user.name}</h1>
          <p className="text-gray-600 my-2">{tweet.tweet}</p>
          { tweet.image && <div className="my-2">
            <img src={tweet.image} alt={tweet.id} className="object-contain" />
          </div>}
        </div>
      </div>
      <div className="flex justify-evenly m-2">
        <ChatBubbleOvalLeftIcon className="w-6 h-6 text-[#1ca0f2]" />
        <HeartIcon className="w-6 h-6 text-[#1ca0f2]" />
        <ArrowsUpDownIcon className="w-6 h-6 text-[#1ca0f2]" />
        <ArrowUpTrayIcon className="w-6 h-6 text-[#1ca0f2]" />
      </div>
    </div>
  );
}
