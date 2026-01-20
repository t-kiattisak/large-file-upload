import { useState } from "react"
import * as UpChunk from "@mux/upchunk"
import type { FileUploadState, UploadProvider } from "../types"

export const useUpload = () => {
  const [files, setFiles] = useState<FileUploadState[]>([])
  const [provider, setProvider] = useState<UploadProvider>("local")

  const startUpload = (uploadState: FileUploadState) => {
    const uploadId = crypto.randomUUID()
    const endpoint =
      provider === "local"
        ? "http://localhost:3000/upload"
        : "http://localhost:3000/upload/s3"

    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadState.id ? { ...f, status: "uploading", uploadId } : f,
      ),
    )

    const upload = UpChunk.createUpload({
      endpoint,
      file: uploadState.file,
      chunkSize: 1024,
      headers: {
        "x-file-name": uploadState.file.name,
        "x-upload-id": uploadId,
      },
    })

    upload.on("progress", (e) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadState.id ? { ...f, progress: e.detail } : f,
        ),
      )
    })

    upload.on("success", () => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadState.id
            ? { ...f, status: "success", progress: 100 }
            : f,
        ),
      )
    })

    upload.on("error", (err) => {
      console.error(err)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadState.id ? { ...f, status: "error" } : f,
        ),
      )
    })
  }

  const handleFiles = (newFiles: File[]) => {
    const newUploads = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "idle" as const,
    })) as FileUploadState[]

    setFiles((prev) => [...prev, ...newUploads])
    newUploads.forEach((uploadState) => startUpload(uploadState))
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return {
    files,
    provider,
    setProvider,
    handleFiles,
    removeFile,
  }
}
