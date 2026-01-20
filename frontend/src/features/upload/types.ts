export interface FileUploadState {
  id: string
  file: File
  progress: number
  status: "idle" | "uploading" | "success" | "error"
  uploadId?: string
}

export type UploadProvider = "local" | "s3"
