import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Latency({ signedIn, setSignedIn, user, setUser }) {
  //   const [latency, setLatency] = useState(null);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [latency, setLatency] = useState("");
  const [pageRender, setPageRender] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    axios
      .get("http://localhost:3000/verify-token", {
        headers: {
          authorization: accessToken,
        },
      })
      .then((res) => {
        console.log(res);
        axios
          .get("http://localhost:3000/latency", {
            headers: {
              authorization: accessToken,
              refreshToken: refreshToken,
            },
          })
          .then((res) => {
            console.log(res);
            setUser(res.data.userId);
            setSignedIn(true);
            setLoaded(true);
            setLatency(res.data.latency);
          });
      })
      .catch((err) => {
        console.log(err);

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
              setLoaded(true);
              setPageRender(!pageRender);
            })
            .catch((err) => {
              console.log(err);
              setLoaded(true);
            });
        }
      });
  }, [setSignedIn, setUser, pageRender]);

  return (
    <div>
      {loaded &&
        (signedIn ? (
          <div>
            <h1>Latency</h1>
            <p>User Latency: {latency}</p>
            <button onClick={() => navigate("/")}>Go back</button>
          </div>
        ) : (
          <div>
            <p>Please log in first</p>
            <button onClick={() => navigate("/")}>Go back</button>
          </div>
        ))}
    </div>
  );
}

export default Latency;
