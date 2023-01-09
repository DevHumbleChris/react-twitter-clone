import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

export default function TweetPost() {
  const { tagName, tweetID } = useParams();
  const [tweet, setTweet] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const q = query(collection(db, 'tweets'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, (querySnapshot) => {
      let tweets = []
      querySnapshot.forEach(doc => {
        tweets.push({ ...doc.data(), id: doc.id})
      })
      const theTweet = tweets.find(letweet => letweet.id === tweetID)
      setTweet(theTweet)
      console.log(tweet)
    })
    return () => unsub();
  }, []);
  return (
    <section className="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4 p-2">
      <div className="sticky top-0 p-2 flex space-x-2 items-center text-lg">
        <Link to="/home">
          <ChevronLeftIcon className="w-6" />
        </Link>
        <h1>Tweet</h1>
      </div>
      <div className="p-3">
        <div className="flex gap-x-3 relative my-2">
          <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600"></span>
          <img src={tweet.user.photoURL} alt="" className="h-11 w-11 rounded-full" />
          <div>
            <div className="inline-block group">
              <div className="flex items-center space-x-2 justify-between">
                <h4 className="font-bold text-[15px] sm:text-base">
                  {tweet.user.name}
                </h4>
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span className="text-[10px] sm:text-base">heelo</span>
              </div>
              <div>
                <p className="text-gray-600 my-2">{tweet.tweet}</p>
                {tweet.image && (
                  <div className="my-2">
                    <img
                      src={tweet.image}
                      alt={tweet.id}
                      className="object-contain rounded-xl"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-4 space-x-3 w-full">
          <img src={user.photoURL} alt="" className="h-11 w-11 rounded-full" />
        </div>
      </div>
    </section>
  );
}
