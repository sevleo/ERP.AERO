import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";
import Protected from "./components/Protected";
import Home from "./components/Home";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/protected" element={<Protected />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
