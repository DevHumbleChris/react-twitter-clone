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
  const [retweets, setRetweets] = useState([]);
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
      <div className="p-3">
        <div className="flex gap-x-3 relative my-2">
          <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600"></span>
          <img
            src={tweet?.user.photoURL}
            alt=""
            className="h-11 w-11 rounded-full"
          />
          <div>
            <div className="inline-block group">
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
              <div className="flex justify-evenly m-2">
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
                {tweet.user.uid === user.uid && (
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
        </div>
        {/* <div className="flex mt-4 space-x-3 w-full">
          <img src={user.photoURL} alt="" className="h-11 w-11 rounded-full" />
        </div> */}
      </div>
    </section>
  );
}
