import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";

export default function TweetsUser() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("timestamp"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let tweets = [];
      querySnapshot.forEach((doc) => {
        tweets.push({ ...doc.data(), id: doc.id });
      });
      setTweets(tweets);
    });

    return () => unsub();
  }, []);
  return <div>TweetsUser</div>;
}
