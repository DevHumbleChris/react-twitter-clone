import {
  ArrowsUpDownIcon,
  ChatBubbleOvalLeftIcon,
  ChevronLeftIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowsUpDownIcon as ArrowsUpDownIconFilled,
  HeartIcon as HeartIconFilled,
} from "@heroicons/react/20/solid";
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
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [retweets, setRetweets] = useState([]);
  const [isRetweeted, setIsReTweeted] = useState(false);
  const [tweetLoading, setTweetLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const q = query(collection(db, "tweets", tweetID, "comments"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let theComments = [];
      querySnapshot.forEach((doc) => {
        theComments.push({ ...doc.data(), id: doc.id });
      });
      setComments(theComments);
    });
    return () => unsub();
  }, [tweetID]);

  useEffect(() => {
    const q = query(collection(db, "tweets", tweetID, "likes"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let theLikes = [];
      querySnapshot.forEach((doc) => {
        theLikes.push({ ...doc.data(), id: doc.id });
      });
      setLikes(theLikes);
    });
    return () => unsub();
  }, [tweetID]);

  useEffect(() => {
    const q = query(collection(db, "tweets", tweetID, "retweets"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let theRetweets = [];
      querySnapshot.forEach((doc) => {
        theRetweets.push({ ...doc.data(), id: doc.id });
      });
      setRetweets(theRetweets);
    });
    return () => unsub();
  }, [tweetID]);

  const getTweet = async () => {
    const docSnap = await getDoc(doc(db, "tweets", tweetID));
    if (docSnap.exists()) {
      setTweet({ ...docSnap.data(), id: docSnap.id });
    }
    console.log(tweet);
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "tweets", tweetID), (doc) => {
      setTweet({ ...doc.data(), id: doc.id });
    });
    return () => unsub();
  }, [tweetID]);
  return (
    <section className="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4 p-2">
      <div className="sticky top-0 p-2 flex space-x-2 items-center text-lg">
        <Link to="/home">
          <ChevronLeftIcon className="w-6" />
        </Link>
        <h1>Tweet</h1>
      </div>
      {tweet ? (
        <div className="p-3">
          <div className="flex gap-x-3 relative my-2">
            <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600"></span>
            <img
              src={tweet?.user.photoURL}
              alt=""
              className="h-11 w-11 rounded-full"
            />
            <div className="inline-block w-full">
              <div>
                <div className="inline-block group w-full">
                  <div className="flex items-center space-x-2 justify-between">
                    <h4 className="font-bold text-[15px] sm:text-base">
                      {tweet?.user.name}
                    </h4>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-[10px] sm:text-base">heelo</span>
                  </div>
                  <div>
                    <p className="text-gray-600 my-2">{tweet?.tweet}</p>
                    {tweet?.image && (
                      <div className="my-2">
                        <img
                          src={tweet?.image}
                          alt={tweet?.id}
                          className="object-contain rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex my-2 justify-between w-full">
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={(e) => commentPost(e)}
                >
                  <ChatBubbleOvalLeftIcon className="w-6 h-6 text-[#1ca0f2]" />
                  {comments.length > 0 && <p>{comments.length}</p>}
                </div>
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={(e) => likePost(e)}
                >
                  {liked ? (
                    <HeartIconFilled className="text-[#f60100] w-6" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-[#1ca0f2]" />
                  )}
                  {likes.length > 0 && <p>{likes.length}</p>}
                </div>
                {tweet?.user.uid === user.uid && (
                  <TrashIcon
                    className="text-[#f60100] w-6 cursor-pointer"
                    onClick={() => deleteTweet(tweet)}
                  />
                )}
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={(e) => retweetPost(e)}
                >
                  {isRetweeted ? (
                    <ArrowsUpDownIconFilled className="w-6 h-6 text-green-700" />
                  ) : (
                    <ArrowsUpDownIcon className="w-6 h-6 text-[#1ca0f2]" />
                  )}
                  {retweets.length > 0 && <p>{retweets.length}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-4 space-x-3 w-full">
            <img
              src={user?.photoURL}
              alt=""
              className="h-11 w-11 rounded-full"
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto my-12 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="#1ca0f2"
            className="w-12 h-12 mx-auto"
          >
            <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
          </svg>
          <p className="text-center my-2">Loading Tweet...</p>
        </div>
      )}
    </section>
  );
}
