import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Protected() {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken);
    axios
      .get("http://localhost:3000/protected", {
        headers: {
          authorization: accessToken,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        navigate("/signin");
      });
  }, [navigate]);
  return (
    <div>
      <h1>Protected</h1>
    </div>
  );
}

export default Protected;
