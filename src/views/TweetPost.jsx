import {
  ArrowsUpDownIcon,
  ChatBubbleOvalLeftIcon,
  ChevronLeftIcon,
  HeartIcon,
  TrashIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowsUpDownIcon as ArrowsUpDownIconFilled,
  HeartIcon as HeartIconFilled,
} from "@heroicons/react/20/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { openDeleteModal, openModal } from "../store/slices/modalSlice";
import moment from "moment";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import DeleteTweet from "../components/DeleteTweet";

export default function TweetPost() {
  const { tagName, tweetID } = useParams();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [retweets, setRetweets] = useState([]);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const deleteModal = useSelector((state) => state.modal.deleteModal);
  const [tweetReply, setTweetReply] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef();

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

  useEffect(() => {
    const q = query(
      collection(db, "tweets", tweetID, "comments"),
      orderBy("timestamp", "desc")
    );
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

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "tweets", tweetID), (doc) => {
      setTweet({ ...doc.data(), id: doc.id });
    });
    return () => unsub();
  }, [tweetID]);

  const timeOfUpdate = (time) => {
    return moment(time).startOf("hour").fromNow();
  };

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

  const commentOnPost = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(
      collection(db, "tweets", tweet.id, "comments"),
      {
        comment: tweetReply,
        user: {
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
        },
        timestamp: serverTimestamp(),
      }
    );
    const imageRef = ref(
      storage,
      `tweets/${tweet.id}/comments/${docRef.id}/images`
    );
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "tweets", tweet.id, "comments", docRef.id), {
          image: downloadURL,
        });
      });
      setTweetReply("");
      setSelectedFile(null);
    }
    setTweetReply("");
    setSelectedFile(null);
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
    <section className="w-full scrollbar-hide overflow-scroll col-span-5 sm:col-span-4">
      <div className="sticky top-0 p-2 flex space-x-2 items-center text-lg">
        <Link to="/home">
          <ChevronLeftIcon className="w-6" />
        </Link>
        <h1>Tweet</h1>
      </div>
      {tweet ? (
        <>
          {deleteModal && <DeleteTweet />}
          <div className="border-b border-gray-300">
            <div className="p-3">
              <div>
                <div className="flex space-x-2">
                  <img
                    src={tweet?.user?.photoURL}
                    alt=""
                    className="h-11 w-11 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-[15px] sm:text-base">
                        {tweet?.user.name}
                      </h4>
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div>{timeOfUpdate(tweet?.timestamp?.toDate())}</div>
                    </div>
                    <h5 className="text-[15px] sm:text-base">
                      <span className="text-[#1ca0f2]">{tagName}</span>
                    </h5>
                  </div>
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
              <div className="text-[15px] my-2 sm:text-base flex items-center justify-between">
                <div className="flex space-x-2">
                  <p>{comments.length}</p>
                  <p>Comments</p>
                </div>
                <div className="flex space-x-2">
                  <p>{likes.length}</p>
                  <p>Likes</p>
                </div>
                <div className="flex space-x-2">
                  <p>{retweets.length}</p>
                  <p>Retweets</p>
                </div>
              </div>
              <div className="flex my-3 justify-between w-full">
                <div className="flex items-center space-x-1">
                  <ChatBubbleOvalLeftIcon className="w-6 h-6 text-[#1ca0f2]" />
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
                </div>
                <div
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={(e) => retweetPost(e)}
                >
                  {isRetweeted ? (
                    <ArrowsUpDownIconFilled className="w-6 h-6 text-green-700" />
                  ) : (
                    <ArrowsUpDownIcon className="w-6 h-6 text-[#1ca0f2]" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-300 p-2">
            <div className="flex mt-4 space-x-3 w-full">
              <img
                src={user?.photoURL}
                alt=""
                className="h-11 w-11 rounded-full"
              />
              <form onSubmit={commentOnPost} className="flex-grow">
                <textarea
                  placeholder={`Replying to ${tagName}`}
                  rows="2"
                  value={tweetReply}
                  onChange={(e) => setTweetReply(e.target.value)}
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
                    disabled={!tweetReply}
                    type="submit"
                  >
                    Tweet
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="p-3">
            <div className="relative">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex space-x-2 my-4 border-b border-gray-300"
                >
                  <img
                    src={comment?.user?.photoURL}
                    alt=""
                    className="h-11 w-11 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-[15px] sm:text-base">
                        {comment?.user.name}
                      </h4>
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div>{timeOfUpdate(comment?.timestamp?.toDate())}</div>
                    </div>
                    <h5 className="text-[15px] sm:text-base">
                      Replying to
                      <span className="text-[#1ca0f2] mx-2">{tagName}</span>
                    </h5>
                    <p className="text-gray-600 my-2">{comment?.comment}</p>
                    {comment?.image && (
                      <div className="my-2">
                        <img
                          src={comment?.image}
                          alt={comment?.id}
                          className="object-contain rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
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
