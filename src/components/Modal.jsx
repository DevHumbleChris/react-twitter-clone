import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../store/slices/modalSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebaseConfig";
import { PhotoIcon } from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function Modal() {
  const isOpen = useSelector((state) => state.modal.isModalOpen);
  const tweet = useSelector((state) => state.modal.selectedTweet);
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const [tweetReply, setTweetReply] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef();

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
  const timeOfUpdate = (time) => {
    return moment(time).startOf("hour").fromNow();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(openModal())}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 absolute bg-[#1ca0f2] rounded-full top-3 right-3 cursor-pointer"
                  onClick={() => dispatch(openModal())}
                >
                  <XMarkIcon className="w-6 text-white" />
                </Dialog.Title>
                <div className="flex gap-x-3 relative my-2">
                  <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600"></span>
                  <img
                    src={tweet.user.photoURL}
                    alt=""
                    className="h-11 w-11 rounded-full"
                  />
                  <div>
                    <div className="inline-block group">
                      <div className="flex items-center space-x-2 justify-between">
                        <h4 className="font-bold text-[15px] sm:text-base">
                          {tweet.user.name}
                        </h4>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <span className="text-[10px] sm:text-base">
                          {timeOfUpdate(tweet.timestamp.toDate())}
                        </span>
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
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-11 w-11 rounded-full"
                  />
                  <form onSubmit={commentOnPost} className="flex-grow">
                    <textarea
                      placeholder="Reply tweet..."
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
                        disabled={!tweetReply}
                        type="submit"
                      >
                        Tweet
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
