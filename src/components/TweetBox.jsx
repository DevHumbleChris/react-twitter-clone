import { PhotoIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function TweetBox() {
  const [tweet, setTweet] = useState("");
  const [user] = useAuthState(auth);
  const [emoji, setEmoji] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "tweets"), {
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

    const imageRef = ref(storage, `tweets/${docRef.id}/images`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "tweets", docRef.id), {
          image: downloadURL,
        });
      });
    }
    setTweet("");
    setSelectedFile(null);
  };
  const addEmoji = (selectedEmoji) => {
    setEmoji(selectedEmoji);
    setTweet(tweet + emoji);
  };
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <>
      <div className="flex mt-4 space-x-3 w-full">
        <img src={user.photoURL} alt="" className="h-11 w-11 rounded-full" />
        <form onSubmit={handleSubmit} className="flex-grow">
          <textarea
            rows="2"
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="What's Happening?"
            className="outline-none tracking-wide min-h-[80px] bg-transparent w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
          {selectedFile && (
            <div className="relative my-2">
              <div
                className="w-8 h-8 left-1 cursor-pointer"
                onClick={() => setSelectedFile(null)}
              >
                <XMarkIcon className="text-black h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain mb-2"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotoIcon className="w-8 text-[#1ca0f2]" />
                <input
                  type="file"
                  hidden
                  onChange={addImageToPost}
                  ref={filePickerRef}
                />
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                fill="#1ca0f2"
                className="w-6 cursor-pointer"
              >
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm80 168c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm-160 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm194.8 170.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5 22.4 26.9 55.2 42.2 90.2 42.2s67.8-15.4 90.2-42.2c13.4-16.2 38.1 4.2 24.6 20.5z" />
              </svg>
            </div>
            <button
              className="bg-[#1ca0f2] text-white p-2 my-2 rounded-2xl"
              disabled={!tweet}
              type="submit"
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
