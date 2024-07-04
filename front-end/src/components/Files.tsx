/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Files({ signedIn, setSignedIn, setUser }: any) {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [listSize, setListSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(accessToken);
    console.log(refreshToken);

    axios
      .get("http://localhost:3000/verify-token", {
        headers: {
          authorization: accessToken,
          refreshToken: refreshToken,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.newAccessToken) {
          localStorage.setItem("accessToken", res.data.newAccessToken);
        }
        setSignedIn(true);
        setUser(res.data.userId);
        fetchFiles(accessToken as any, refreshToken as any, page, listSize);
        // setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
        setSignedIn(false);

        // if (
        //   err.response.statusText === "Unauthorized" &&
        //   err.response.status === 401
        // ) {
        //   console.log(err.response.statusText);
        //   axios
        //     .get("http://localhost:3000/signin/new_token", {
        //       headers: {
        //         authorization: refreshToken,
        //       },
        //     })
        //     .then((res) => {
        //       localStorage.setItem("accessToken", res.data.accessToken);
        //       console.log(res);
        //       setUser(res.data.user.id);
        //       setSignedIn(true);
        //       fetchFiles(res.data.accessToken, page, listSize);
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //       setLoaded(true);
        //     });
        // }
      });
  }, [setSignedIn, setUser, page, listSize]);

  const fetchFiles = (
    accessToken: string,
    refreshToken: string,
    page: number,
    listSize: number
  ) => {
    axios
      .get("http://localhost:3000/file/list", {
        headers: {
          authorization: accessToken,
          refreshToken: refreshToken,
        },
        params: {
          page,
          list_size: listSize,
        },
      })
      .then((res) => {
        if (res.data.newAccessToken) {
          localStorage.setItem("accessToken", res.data.newAccessToken);
        }
        console.log(res);
        setFiles(res.data.files);
        setTotalPages(res.data.totalPages);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setLoaded(true);
      });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleListSizeChange = (event: any) => {
    setListSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const deleteFile = (id: number) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    axios
      .delete(`http://localhost:3000/file/delete/${id}`, {
        headers: {
          authorization: accessToken,
          refreshToken: refreshToken,
        },
      })
      .then((res) => {
        if (res.data.newAccessToken) {
          localStorage.setItem("accessToken", res.data.newAccessToken);
        }
        console.log(res.data.message);
        fetchFiles(accessToken as any, refreshToken as any, page, listSize);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadFile = (fileId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    axios
      .get(`http://localhost:3000/file/${fileId}`, {
        headers: {
          authorization: accessToken,
          refreshToken: refreshToken,
        },
      })
      .then((res) => {
        console.log(res);

        if (res.data.newAccessToken) {
          localStorage.setItem("accessToken", res.data.newAccessToken);
        }
        const fileName = res.data.file.file_name;
        console.log(`${fileName}`);
        axios
          .get(`http://localhost:3000/file/download/${fileId}`, {
            headers: {
              authorization: accessToken,
              refreshToken: refreshToken,
            },
            responseType: "blob", // Specify the response type as blob
          })
          .then((res) => {
            console.log(res);
            // Create a blob object from the response data
            const blob = new Blob([res.data], {
              type: res.headers["content-type"],
            });

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a link element and simulate click to trigger download
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${fileName}`); // Set the file name for download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up: Revoke the URL object
            window.URL.revokeObjectURL(url);
          });
      })

      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {loaded &&
        (signedIn ? (
          <div>
            <h1>Files</h1>
            <label>
              Items per page:
              <select value={listSize} onChange={handleListSizeChange}>
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
            <ul>
              {files.map((file) => (
                <li key={file.id}>
                  {file.id} | {file.file_name} - {file.file_size} bytes
                  <button onClick={() => deleteFile(file.id)}>Delete</button>
                  <button onClick={() => navigate(`/file/${file.id}`)}>
                    View Details
                  </button>
                  <button onClick={() => downloadFile(file.id)}>
                    Download
                  </button>
                </li>
              ))}
            </ul>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    disabled={pageNum === page}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
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
