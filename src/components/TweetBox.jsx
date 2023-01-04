import {
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function TweetBox() {
  const [tweet, setTweet] = useState("");
  const [user] = useAuthState(auth);
  const [emoji, setEmoji] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef()
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
    setTweet("");
  };
  const addEmoji = (selectedEmoji) => {
    setEmoji(selectedEmoji);
    setTweet(tweet + emoji);
  };
  const addImageToPost = () => {

  }
  return (
    <>
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
              <div className="flex items-center cursor-pointer" onClick={() => filePickerRef.current.click()}>
                <PhotoIcon className="w-8 text-[#1ca0f2]" />
                <input type="file" hidden onChange={addImageToPost} ref={filePickerRef} />
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                fill="#1ca0f2"
                className="w-8 cursor-pointer"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm194.8 170.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5 22.4 26.9 55.2 42.2 90.2 42.2s67.8-15.4 90.2-42.2c13.4-16.2 38.1 4.2 24.6 20.5z" />
              </svg>
              {showEmoji && (
                <div className="absolute top-[13.5rem] left-[3.5rem] sm:left-[10rem] md:left-[15rem] lg:left-[20rem] xl:left-[23rem] max-w-[320px]">
                  <Picker
                    data={data}
                    onEmojiSelect={(selectedEmoji) =>
                      addEmoji(selectedEmoji.native)
                    }
                    theme="light"
                  />
                </div>
              )}
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
      {selectedFile && (
        <div className="relative">
          <div
            className="w-8 h-8 left-1 cursor-pointer"
            onClick={() => setSelectedFile(null)}
          >
            <XMarkIcon className="text-black h-5" />
          </div>
          <img
            src={selectedFile}
            alt=""
            className="rounded-2xl max-h-80 object-contain"
          />
        </div>
      )}
    </>
  );
}
