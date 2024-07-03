import { useState, useEffect } from "react";
import axios from "axios";
import Signin from "./Signin";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";

function Home({ signedIn, setSignedIn, user, setUser }) {
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

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
        setUser(res.data.user.id);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
        if (
          err.response.statusText === "Unauthorized" &&
          err.response.status === 401
        ) {
          console.log(err.response.statusText);
          axios
            .get("http://localhost:3000/signin/new_token", {
              headers: {
                authorization: refreshToken,
              },
            })
            .then((res) => {
              localStorage.setItem("accessToken", res.data.accessToken);
              console.log(res);
              setUser(res.data.user.id);
              setSignedIn(true);
            })
            .catch((err) => {
              console.log(err);
            });
        }
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
    loaded && (
      <div>
        {signedIn ? (
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
              <h1>Welcome!</h1>
              <p>Sign in to your account:</p>
              <Signin setUser={setUser} setSignedIn={setSignedIn} />
              <p>Don't have an account yet?</p>
              <Signup setUser={setUser} setSignedIn={setSignedIn} />
            </div>
          </>
        )}
        <button
          onClick={() => {
            navigate("/info");
          }}
        >
          Info
        </button>
        <button
          onClick={() => {
            navigate("/latency");
          }}
        >
          Latency
        </button>
      </div>
    )
  );
}

export default Home;
