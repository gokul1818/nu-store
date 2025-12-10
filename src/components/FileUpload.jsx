import { useState } from "react";
import { UploadAPI } from "../services/api";

export default function FileUpload({
  id, // unique id
  label = "Upload Files",
  value = null,
  onChange,
  mode = "single",
  error = "",
  maxSize = 5, // ⭐ Max file size in MB
}) {
  const [uploading, setUploading] = useState(false);

  /** Check file size */
  const validateFileSize = (file) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`File "${file.name}" is too large. Max allowed size is ${maxSize}MB.`);
      return false;
    }
    return true;
  };

  /** Upload a single file */
  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);

    try {
      const res = await UploadAPI.thumbnail(fd);
      return res.data.url;
    } catch (err) {
      console.error(err);
      alert("Upload error!");
      return null;
    } finally {
      setUploading(false);
    }
  };

  /** Handle file selection */
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    // Validate size(s)
    for (let file of files) {
      if (!validateFileSize(file)) {
        return; // Stop if any file is too large
      }
    }

    if (mode === "single") {
      const url = await uploadFile(files[0]);
      if (url) onChange(url);
    } else {
      const newUrls = [];
      for (let file of files) {
        const url = await uploadFile(file);
        if (url) newUrls.push(url);
      }
      onChange([...(value || []), ...newUrls]);
    }
  };

  /** Handle drag & drop */
  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`
          border-2 border-dashed rounded p-4 text-center cursor-pointer 
          hover:bg-gray-50
          ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
        `}
      >
        <input
          type="file"
          accept="image/*"
          multiple={mode === "multiple"}
          onChange={(e) => handleFiles(e.target.files)}
          id={id}
          className="hidden"
        />

        <label htmlFor={id} className="cursor-pointer text-gray-400">
          {uploading
            ? "Uploading..."
            : `Click or Drag files to upload (${mode}) — Max ${maxSize}MB`}
        </label>
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      {/* Single Preview */}
      {mode === "single" && value && (
        <div className="relative inline-block mt-3">
          <img
            src={value}
            alt="preview"
            className="w-32 h-32 rounded object-cover border"
          />
          <button
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
          >
            X
          </button>
        </div>
      )}

      {/* Multiple Previews */}
      {mode === "multiple" && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {value.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                className="w-24 h-24 object-cover rounded border"
                alt="uploaded"
              />
              <button
                onClick={() => {
                  const updated = value.filter((_, idx) => idx !== i);
                  onChange(updated);
                }}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
