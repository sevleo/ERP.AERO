/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FileDetails({ signedIn, setSignedIn, setUser }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [file, setFile] = useState<any>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    axios
      .get(`http://localhost:3000/verify-token`, {
        headers: {
          authorization: accessToken,
        },
      })
      .then((res) => {
        setUser(res.data.userId);
        setSignedIn(true);
        fetchFileDetails(accessToken as any, id as any);
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
              fetchFileDetails(res.data.accessToken, id as any);
            })
            .catch((err) => {
              console.log(err);
              setLoaded(true);
            });
        }
      });
  }, [setSignedIn, setUser, id]);

  const fetchFileDetails = (accessToken: string, fileId: string) => {
    axios
      .get(`http://localhost:3000/file/${fileId}`, {
        headers: {
          authorization: accessToken,
        },
      })
      .then((res) => {
        setFile(res.data.file);
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
            <h1>File Details</h1>
            {file ? (
              <div>
                <p>File Name: {file.file_name}</p>
                <p>File Extension: {file.file_extension}</p>
                <p>MIME Type: {file.mime_type}</p>
                <p>File Size: {file.file_size} bytes</p>
                <p>Upload Date: {file.upload_date}</p>
                {/* <p>Name in the local storage: {file.filename}</p> */}

                <button onClick={() => navigate("/files")}>Go back</button>
              </div>
            ) : (
              <p>File not found</p>
            )}
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
