import { useState, useEffect } from "react";
import axios from "axios";
import Signin from "./Signin";
import Signup from "./Signup";
import React from "react";

function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    console.log(accessToken);
    axios
      .get("http://localhost:3000/verify-token", {
        headers: {
          authorization: accessToken,
          refreshToken: refreshToken,
        },
      })
      .then((res) => {
        console.log(res);
        setSignedIn(true);
        setUser(res.data.user.username);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/logout", {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      })
      .then(() => {
        setSignedIn(false);
        setUser("");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    loaded &&
    (signedIn ? (
      <>
        <div>
          <h1>
            Welcome back, <span>{user}</span>
          </h1>
          <p>
            <button onClick={handleLogout}>Logout</button>
          </p>
        </div>
      </>
    ) : (
      <>
        <div>
          <p>Welcome! Sign in to your account:</p>
          <Signin setUser={setUser} setSignedIn={setSignedIn} />
          <p>Don't have an account yet?</p>
          <Signup setUser={setUser} setSignedIn={setSignedIn} />
        </div>
      </>
    ))
  );
}

export default Home;
