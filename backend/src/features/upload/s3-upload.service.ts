import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3"

interface Part {
  ETag: string
  PartNumber: number
}

export class S3UploadService {
  private s3Client: S3Client
  private uploadMap: Map<string, { uploadId: string; parts: Part[] }>
  private bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    })
    this.bucketName = process.env.AWS_BUCKET_NAME || ""
    this.uploadMap = new Map()
  }

  async handleChunk(
    fileName: string,
    uploadId: string,
    start: number,
    end: number,
    total: number,
    data: ArrayBuffer,
  ): Promise<String> {
    if (!this.bucketName) {
      throw new Error("AWS_BUCKET_NAME is not configured")
    }

    if (!uploadId) {
      throw new Error("uploadId is required")
    }

    if (start === 0) {
      const command = new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: fileName,
      })
      const response = await this.s3Client.send(command)
      if (!response.UploadId) {
        throw new Error("Failed to initiate multipart upload")
      }
      this.uploadMap.set(uploadId, { uploadId: response.UploadId, parts: [] })
    }

    const uploadInfo = this.uploadMap.get(uploadId)
    if (!uploadInfo) {
      throw new Error("Upload session not found for ID: " + uploadId)
    }

    const partNumber = uploadInfo.parts.length + 1

    const uploadPartCommand = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: fileName,
      UploadId: uploadInfo.uploadId,
      PartNumber: partNumber,
      Body: new Uint8Array(data),
    })

    const partResponse = await this.s3Client.send(uploadPartCommand)

    if (!partResponse.ETag) {
      throw new Error("Failed to upload part: No ETag returned")
    }

    uploadInfo.parts.push({
      ETag: partResponse.ETag,
      PartNumber: partNumber,
    })

    if (end + 1 === total) {
      uploadInfo.parts.sort((a, b) => a.PartNumber - b.PartNumber)

      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: fileName,
        UploadId: uploadInfo.uploadId,
        MultipartUpload: {
          Parts: uploadInfo.parts,
        },
      })

      await this.s3Client.send(completeCommand)
      this.uploadMap.delete(uploadId)
      console.log(`S3 Upload complete for ${fileName} (ID: ${uploadId})`)
      return "Complete"
    }

    return "In-progress"
  }
}
