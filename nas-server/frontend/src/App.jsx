import { useEffect, useState } from "react";

const API_URL = "http://192.168.1.38:8000";

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  async function loadFiles() {
    try {
      const response = await fetch(`${API_URL}/files`);
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  }

  async function uploadFile() {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      setSelectedFile(null);
      loadFiles();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  async function deleteFile(filename) {
    try {
      await fetch(`${API_URL}/delete/${filename}`, {
        method: "DELETE",
      });

      loadFiles();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Ashith NAS</h1>

      <hr />

      <h2>Upload File</h2>

      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <button
        onClick={uploadFile}
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
        }}
      >
        Upload
      </button>

      <hr />

      <h2>Files</h2>

      {files.length === 0 ? (
        <p>No files found</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file} style={{ marginBottom: "10px" }}>
              <strong>{file}</strong>

              <a
                href={`${API_URL}/download/${file}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  marginLeft: "15px",
                }}
              >
                Download
              </a>

              <button
                onClick={() => deleteFile(file)}
                style={{
                  marginLeft: "10px",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;