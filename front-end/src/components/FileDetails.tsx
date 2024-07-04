/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function FileDetails({ signedIn, setSignedIn, setUser }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("waiting to upload file...");

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const updateFile = async (fileId: string) => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile as any);

    console.log(fileId);
    console.log(selectedFile);

    try {
      const response = await axios.put(
        `http://localhost:3000/file/update/${fileId}`,
        formData,
        {
          headers: {
            authorization: localStorage.getItem("accessToken"),
          },
        }
      );
      console.log(response);
      setMessage("File updated successfully.");
      fetchFileDetails(localStorage.getItem("accessToken") as string, fileId);
    } catch (err) {
      console.error("Error uploading file:", err);
      setMessage("Error updating file.");
    }
  };

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
                <br />
                <input
                  type="file"
                  onChange={handleFileChange}
                  onClick={() => setMessage("waiting to upload a file...")}
                />
                <button onClick={() => updateFile(file.id)}>Update</button>
                <p>{message}</p>
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
