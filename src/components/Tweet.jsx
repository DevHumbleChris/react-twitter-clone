import {
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconFilled,
  ArrowsUpDownIcon as ArrowsUpDownIconFilled,
  TrashIcon,
} from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { openDeleteModal, openModal } from "../store/slices/modalSlice";
import { Link } from "react-router-dom";
import { addTweetPostData } from "../store/slices/tweetPostSlice";
import moment from "moment";

export default function Tweet({ tweet }) {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch();
  const [tagName, setTagName] = useState("");
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [retweets, setRetweets] = useState([]);
  const [time, setTime] = useState('')

  useEffect(() => {
    const newTagName = tweet.user.name.split(" ").join("-").toLowerCase();
    setTagName(newTagName);
  }, [tweet]);

  useEffect(() => {
    const q = query(collection(db, "tweets", tweet.id, "retweets"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let retweetsNew = [];
      querySnapshot.forEach((doc) => {
        retweetsNew.push({ ...doc.data(), id: doc.id });
      });
      setRetweets(retweetsNew);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "tweets", tweet.id, "likes"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let newLikes = [];
      querySnapshot.forEach((doc) => {
        newLikes.push({ ...doc.data(), id: doc.id });
      });
      setLikes(newLikes);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "tweets", tweet.id, "comments"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let newComments = [];
      querySnapshot.forEach((doc) => {
        newComments.push({ ...doc.data(), id: doc.id });
      });
      setComments(newComments);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const timeStamp = tweet?.timestamp?.toDate()
    const tweetPostTime = moment(timeStamp).startOf("hour").fromNow()
    setTime(tweetPostTime)
  }, [tweet])

  useEffect(() => {
    const isLiked = likes.filter((like) => like.id === user.uid);
    if (isLiked.length > 0) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes]);

  useEffect(() => {
    const isRetweet = retweets.filter((retweet) => retweet.id === user.uid);
    if (isRetweet.length > 0) {
      setIsRetweeted(true);
    } else {
      setIsRetweeted(false);
    }
  }, [retweets]);

  const likePost = async (e) => {
    if (liked) {
      await deleteDoc(doc(db, "tweets", tweet.id, "likes", user.uid));
    } else {
      await setDoc(doc(db, "tweets", tweet.id, "likes", user.uid), {
        id: tweet.user.uid,
        name: tweet.user.name,
      });
    }
  };

  const retweetPost = async (e) => {
    if (isRetweeted) {
      await deleteDoc(doc(db, "tweets", tweet.id, "retweets", user.uid));
    } else {
      await setDoc(doc(db, "tweets", tweet.id, "retweets", user.uid), {
        id: tweet.user.uid,
        name: tweet.user.name,
      });
    }
  };

  const commentPost = async (e) => {
    dispatch(openModal(tweet));
  };

  const deleteTweet = (tweet) => {
    dispatch(openDeleteModal(tweet));
  };

  return (
    <div className="border border-gray-300 p-2">
      <Link
        to={`/tweet/@${tagName}/${tweet.id}`}
      >
        <div className="flex space-x-2">
          <img
            src={tweet?.user?.photoURL}
            alt="user-logo"
            className="w-16 h-16 border border-gray-200 rounded-full"
          />
          <div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-[15px] sm:text-base">
                  {tweet?.user.name}
                </h4>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <div>{ time }</div>
              </div>
              <h5 className="text-[15px] sm:text-base">
                @<span className="text-[#1ca0f2]">{tagName}</span>
              </h5>
            </div>
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
      </Link>
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
  );
}
