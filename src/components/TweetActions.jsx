import React from "react";

export default function TweetActions() {
  return (
    <div className="flex my-3 justify-between w-full">
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
  );
}
