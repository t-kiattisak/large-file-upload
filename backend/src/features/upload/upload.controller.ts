import { Elysia, t } from "elysia"
import { UploadService } from "./upload.service"

import { S3UploadService } from "./s3-upload.service"

export const uploadController = new Elysia({ prefix: "/upload" })
  .decorate("uploadService", new UploadService())
  .decorate("s3UploadService", new S3UploadService())
  .put(
    "/",
    async ({ request, headers, uploadService, set }) => {
      const contentRange = headers["content-range"]
      const fileName = headers["x-file-name"]
      const uploadId = headers["x-upload-id"]

      if (!contentRange) {
        set.status = 400
        return "Missing Content-Range header"
      }
      if (!fileName) {
        set.status = 400
        return "Missing x-file-name header"
      }
      if (!uploadId) {
        set.status = 400
        return "Missing x-upload-id header"
      }

      const match = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/)
      if (!match) {
        set.status = 400
        return "Invalid Content-Range format"
      }

      const start = parseInt(match[1]!)
      const end = parseInt(match[2]!)
      const total = parseInt(match[3]!)

      try {
        const arrayBuffer = await request.arrayBuffer()
        await uploadService.handleChunk(
          fileName,
          uploadId,
          start,
          end,
          total,
          arrayBuffer,
        )
        return { success: true }
      } catch (err) {
        console.error(err)
        set.status = 500
        return "Internal Server Error"
      }
    },
    {
      headers: t.Object({
        "content-range": t.String(),
        "x-file-name": t.String(),
        "x-upload-id": t.String(),
      }),
    },
  )
  .put(
    "/s3",
    async ({ request, headers, s3UploadService, set }) => {
      const contentRange = headers["content-range"]
      const fileName = headers["x-file-name"]
      const uploadId = headers["x-upload-id"]

      if (!contentRange) {
        set.status = 400
        return "Missing Content-Range header"
      }
      if (!fileName) {
        set.status = 400
        return "Missing x-file-name header"
      }
      if (!uploadId) {
        set.status = 400
        return "Missing x-upload-id header"
      }

      const match = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/)
      if (!match) {
        set.status = 400
        return "Invalid Content-Range format"
      }

      const start = parseInt(match[1]!)
      const end = parseInt(match[2]!)
      const total = parseInt(match[3]!)

      try {
        const arrayBuffer = await request.arrayBuffer()
        await s3UploadService.handleChunk(
          fileName,
          uploadId,
          start,
          end,
          total,
          arrayBuffer,
        )
        return { success: true }
      } catch (err) {
        console.error(err)
        set.status = 500
        return "Internal Server Error"
      }
    },
    {
      headers: t.Object({
        "content-range": t.String(),
        "x-file-name": t.String(),
        "x-upload-id": t.String(),
      }),
    },
  )
