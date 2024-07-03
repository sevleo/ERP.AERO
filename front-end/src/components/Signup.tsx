/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import axios from "axios";

function Signup({ setUser, setSignedIn }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = () => {
    axios
      .post("http://localhost:3000/signup", { username, password })
      .then((user) => {
        console.log(user.data.username);
        localStorage.setItem("accessToken", user.data.accessToken);
        localStorage.setItem("refreshToken", user.data.refreshToken);
        setErrorMessage("");
        setUser(user.data.username);
        setSignedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="off"
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="off"
      />
      <button onClick={submit}>Submit</button>
      <p>{errorMessage}</p>
    </div>
  );
}

export default Signup;
