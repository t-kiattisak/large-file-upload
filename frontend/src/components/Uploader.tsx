import { useState } from "react"
import * as UpChunk from "@mux/upchunk"

const Uploader = () => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle")

  const [provider, setProvider] = useState<"local" | "s3">("local")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setStatus("idle")
      setProgress(0)
    }
  }

  const handleUpload = () => {
    if (!file) return

    setStatus("uploading")

    const uploadId = crypto.randomUUID()
    const endpoint =
      provider === "local"
        ? "http://localhost:3000/upload"
        : "http://localhost:3000/upload/s3"

    const upload = UpChunk.createUpload({
      endpoint,
      file: file,
      chunkSize: 1024, // Reduced to 1MB to simulate more chunks for demo
      headers: {
        "x-file-name": file.name,
        "x-upload-id": uploadId,
      },
    })

    upload.on("progress", (e) => {
      setProgress(e.detail)
    })

    upload.on("success", () => {
      setStatus("success")
      console.log("Upload complete!")
    })

    upload.on("error", (err) => {
      setStatus("error")
      console.error("Upload error:", err)
    })
  }

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <h2>Large File Upload</h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "15px" }}>
          <input
            type='radio'
            name='provider'
            value='local'
            checked={provider === "local"}
            onChange={() => setProvider("local")}
          />
          Local Storage
        </label>
        <label>
          <input
            type='radio'
            name='provider'
            value='s3'
            checked={provider === "s3"}
            onChange={() => setProvider("s3")}
          />
          AWS S3
        </label>
      </div>

      <input type='file' onChange={handleFileChange} />
      <br />
      <br />
      {file && (
        <button onClick={handleUpload} disabled={status === "uploading"}>
          {status === "uploading" ? "Uploading..." : "Start Upload"}
        </button>
      )}

      <div style={{ marginTop: "20px" }}>
        <progress value={progress} max='100' style={{ width: "100%" }} />
        <p>{Math.round(progress)}%</p>
        {status === "success" && (
          <p style={{ color: "green" }}>Upload Successful!</p>
        )}
        {status === "error" && <p style={{ color: "red" }}>Upload Failed.</p>}
      </div>
    </div>
  )
}

export default Uploader
