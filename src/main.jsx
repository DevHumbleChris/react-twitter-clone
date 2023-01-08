import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import { Provider } from "react-redux";
import { store } from "./store";
import TweetPost from "./views/TweetPost";
import HomeTweets from "./components/HomeTweets";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/tweet/:tagName/:tweetID",
        element: <TweetPost />,
      },
      {
        path: "/home",
        element: <HomeTweets />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
