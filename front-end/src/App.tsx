import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Info from "./components/Info";
import Home from "./components/Home";
import Latency from "./components/Latency";
import Files from "./components/Files";
import { useState } from "react";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState("");

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  signedIn={signedIn}
                  setSignedIn={setSignedIn}
                  user={user}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/info"
              element={
                <Info
                  signedIn={signedIn}
                  setSignedIn={setSignedIn}
                  user={user}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/latency"
              element={
                <Latency
                  signedIn={signedIn}
                  setSignedIn={setSignedIn}
                  user={user}
                  setUser={setUser}
                />
              }
            />
            <Route path="/files" element={<Files signedIn={signedIn} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
