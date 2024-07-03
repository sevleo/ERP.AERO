import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Protected from "./components/Protected";
import Home from "./components/Home";
import React from "react";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/protected" element={<Protected />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
