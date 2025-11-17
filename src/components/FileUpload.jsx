import { useState } from "react";
import { UploadAPI } from "../services/api";

export default function FileUpload({
  label = "Upload Files",
  value = null, // can be string OR array
  onChange,
  mode = "single", // "single" | "multiple"
}) {
  const [uploading, setUploading] = useState(false);

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

  const handleFiles = async (files) => {
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

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>

      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:bg-gray-50"
      >
        <input
          type="file"
          accept="image/*"
          multiple={mode === "multiple"}
          onChange={(e) => handleFiles(e.target.files)}
          id="upload-input"
          className="hidden"
        />

        <label htmlFor="upload-input" className="cursor-pointer">
          {uploading ? "Uploading..." : `Click or Drag files to upload (${mode})`}
        </label>
      </div>

      {/* Preview */}
      {mode === "single" && value && (
        <img
          src={value}
          alt="preview"
          className="mt-3 w-32 h-32 rounded object-cover border"
        />
      )}

      {mode === "multiple" && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {value.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                className="w-24 h-24 object-cover rounded border"
                alt="uploaded"
              />

              {/* remove button */}
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
