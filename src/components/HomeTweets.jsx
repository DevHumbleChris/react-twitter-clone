import React from "react";
import TweetBox from "./TweetBox";
import TweetsUser from "./TweetsUser";

export default function HomeTweets() {
  return (
    <section className="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4 p-2">
      <header className="text-xl my-3">Home</header>
      <TweetBox />
      <TweetsUser />
    </section>
  );
}
