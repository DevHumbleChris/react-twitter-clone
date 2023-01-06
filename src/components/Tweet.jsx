import {
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  ArrowUpTrayIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatBubbleOvalLeftIcon as ChatBubbleOvalLeftIconFilled,
} from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import {
  addDoc,
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
import { openModal } from "../store/slices/modalSlice";

export default function Tweet({ tweet }) {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [commented, setCommented] = useState(false);
  const dispatch = useDispatch()

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
    const isLiked = likes.filter((like) => like.id === user.uid);
    if (isLiked.length > 0) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes]);

  useEffect(() => {
    const isCommented = likes.filter((comment) => comment.id === user.uid);
    if (isCommented.length > 0) {
      setCommented(true);
    } else {
      setCommented(false);
    }
  }, [comments]);

  const likePost = async (e) => {
    if (liked) {
      await deleteDoc(doc(db, "tweets", tweet.id, "likes", user.uid));
    } else {
      console.log("am here");
      await setDoc(doc(db, "tweets", tweet.id, "likes", user.uid), {
        id: tweet.user.uid,
        name: tweet.user.name,
      });
    }
  };
  const commentPost = async (e) => {
    dispatch(openModal({...tweet, timestamp: tweet.timestamp.toDate()}))
    // if (commented) {
    //   await deleteDoc(doc(db, "tweets", tweet.id, "comments", user.uid));
    // } else {
    //   await setDoc(doc(db, "tweets", tweet.id, "comments", user.uid), {
    //     id: tweet.user.uid,
    //     name: tweet.user.name,
    //   });
    // }
  };
  return (
    <div className="border border-gray-300 p-2">
      <div className="flex space-x-2">
        <img
          src={tweet.user.photoURL}
          alt="user-logo"
          className="w-16 h-16 border border-gray-200 rounded-full"
        />
        <div>
          <h1>{tweet.user.name}</h1>
          <p className="text-gray-600 my-2">{tweet.tweet}</p>
          {tweet.image && (
            <div className="my-2">
              <img
                src={tweet.image}
                alt={tweet.id}
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-evenly m-2">
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={(e) => commentPost(e)}
        >
          {commented ? (
            <ChatBubbleOvalLeftIconFilled className="w-6 h-6 text-green-600" />
          ) : (
            <ChatBubbleOvalLeftIcon className="w-6 h-6 text-[#1ca0f2]" />
          )}
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
        <ArrowsUpDownIcon className="w-6 h-6 text-[#1ca0f2]" />
        <ArrowUpTrayIcon className="w-6 h-6 text-[#1ca0f2]" />
      </div>
    </div>
  );
}
