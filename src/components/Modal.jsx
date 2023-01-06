import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../store/slices/modalSlice";

export default function Modal() {
  const isOpen = useSelector(state => state.modal.isModalOpen)
  const tweet = useSelector(state => state.modal.selectedTweet)
  const dispatch = useDispatch()
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => dispatch(openModal())}>
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
                <div className="flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600"></span>
                    <img src={tweet.user.photoURL} alt="" className="h-11 w-11 rounded-full" />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
