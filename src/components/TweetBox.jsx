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
    //
    <>
      <div className="flex mt-4 space-x-3 w-full p-2">
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
