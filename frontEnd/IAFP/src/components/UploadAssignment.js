import { useState } from "react";
import.meta.env;
// import { ToastContainer } from 'react-toastify' 
const UploadAssignment = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("assignment", file);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setFileUrl(data.fileUrl);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {fileUrl && (
        <div>
          <p>File Uploaded!</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadAssignment;
