/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Files({ signedIn, setSignedIn, setUser }: any) {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    axios
      .get("http://localhost:3000/verify-token", {
        headers: {
          authorization: accessToken,
          // refreshToken: refreshToken,
        },
      })
      .then((res) => {
        console.log(res);
        setUser(res.data.userId);
        setSignedIn(true);
        fetchFiles(accessToken as any);
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
              fetchFiles(res.data.accessToken);
            })
            .catch((err) => {
              console.log(err);
              setLoaded(true);
            });
        }
      });
  }, [setSignedIn, setUser]);

  const fetchFiles = (accessToken: string) => {
    console.log("fetch files");
    axios
      .get("http://localhost:3000/file/list", {
        headers: {
          authorization: accessToken,
        },
      })
      .then((res) => {
        setFiles(res.data.files);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
      });
  };

  return (
    <div>
      {loaded &&
        (signedIn ? (
          <div>
            <h1>Files</h1>
            <ul>
              {files.map((file) => (
                <li key={file.id}>
                  {file.id} | {file.file_name}
                  {/* {file.file_extension} |{" "}
                  {file.mime_type} | {file.file_size} bytes | {file.upload_date} */}
                </li>
              ))}
            </ul>
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
