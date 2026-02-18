import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState("");

  const [progress, setProgress] = useState(0);

  const [uploading, setUploading] = useState(false);

  const [uploadFile, setUploadFile] = useState(null);

  const apiBase = "http://localhost:3020";

  const onChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setProgress(0);
    setMessage("");
    setUploadFile(null);

    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) return setMessage("Please select a file");

    const formData = new FormData();

    formData.append("file", file);

    setUploading(true);

    setMessage("Uploading...");

    try {
      const res = await axios.post(`${apiBase}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) =>
          setProgress(Math.round((p.loaded * 100) / p.total)),
      });

      setUploadFile(res.data.file);

      setMessage(res.data.message);

      setProgress(0);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Upload failed");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div>FileUpload</div>
      <div>
        <h2>Upload Cloudinary</h2>
        <form onSubmit={onSubmit}>
          <input type="file" name="file" id="" onChange={onChange} />
          {preview && (
            <img
              src={preview}
              style={{ width: 300, height: 300 }}
              alt="images"
            ></img>
          )}
          {progress > 0 && <div>{progress}%</div>}
          <button disabled={uploading} type="submit">
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {/* {message && <p>{message}</p>} */}
        {uploadFile && (
          <div>
            <h1>UploadFiles</h1>
            <h3>file list:</h3>
            <p>{uploadFile.originalName}</p>
            {uploadFile.format?.includes("image") ? (
              <img
                src={uploadFile.url}
                style={{ width: 300, height: 300 }}
                alt="images"
              ></img>
            ) : (
              <a href={uploadFile.url}>View / Download Files</a>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;
