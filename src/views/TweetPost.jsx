import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";

export default function TweetPost() {
  return (
    <section className="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4 p-2">
      <div className="sticky top-0 p-2 flex space-x-2 items-center text-lg">
        <Link to="/home">
          <ChevronLeftIcon className="w-6" />
        </Link>
        <h1>Tweet</h1>
      </div>
      <div>h</div>
    </section>
  );
}
