import { useState } from "react";
import axios from "axios";

function Signin({ setUser, setSignedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submit = () => {
    axios
      .post("http://localhost:3000/signin", { username, password })
      .then((user) => {
        localStorage.setItem("accessToken", user.data.accessToken);
        localStorage.setItem("refreshToken", user.data.refreshToken);
        setErrorMessage("");
        setUser(user.data.username);
        setSignedIn(true);
      })
      .catch((err) => {
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

export default Signin;
