import { GifIcon, ListBulletIcon, MapPinIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function TweetBox() {
  const [tweet, setTweet] = useState("");
  const [user] = useAuthState(auth);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "tweets"), {
      tweet: tweet,
      likes: [],
      comments: [],
      retweets: [],
      user: {
        uid: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
      },
      timestamp: serverTimestamp(),
    });
    setTweet('')
  };
  return (
    <div className="flex space-x-2">
      <img
        src={user.photoURL}
        alt="user-logo"
        className="w-16 h-16 border border-gray-200 rounded-full"
      />
      <form onSubmit={handleSubmit}>
        <textarea
          id="about"
          name="tweet"
          rows="3"
          v-model="tweet"
          value={tweet}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={(e) => setTweet(e.target.value)}
          placeholder="What's Happening?"
        ></textarea>
        <div className="my-3 sm:flex justify-between">
          <div className="flex space-x-2 sm:w-[20rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="#1ca0f2"
              className="w-8"
            >
              <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z" />
            </svg>
            <GifIcon className="text-[#1ca0f2] w-8" />
            <ListBulletIcon className="text-[#1ca0f2] w-8" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              fill="#1ca0f2"
              className="w-8"
            >
              <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm194.8 170.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5 22.4 26.9 55.2 42.2 90.2 42.2s67.8-15.4 90.2-42.2c13.4-16.2 38.1 4.2 24.6 20.5z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="#1ca0f2"
              className="w-8"
            >
              <path d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z" />
            </svg>
            <MapPinIcon className="text-[#1ca0f2] w-8" />
          </div>
          <div>
            <button
              type="submit"
              disabled={!tweet}
              className="bg-[#1ca0f2] text-white p-3 w-full my-2 rounded-2xl"
            >
              Tweet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
