import React from "react";
import TweetBox from "./TweetBox";
import TweetsUser from "./TweetsUser";

export default function HomeTweets() {
  return (
    <section class="overflow-scroll col-span-5 sm:col-span-4 p-2">
      <header class="text-xl my-3">Home</header>
      <TweetBox />
      <TweetsUser />
    </section>
  );
}
