import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Files({ signedIn }) {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(true);

  return (
    <div>
      {loaded &&
        (signedIn ? (
          <div>
            <h1>Files</h1>
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
