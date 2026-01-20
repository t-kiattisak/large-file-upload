import { Hono } from "hono"
import { UploadService } from "./upload.service"
import { S3UploadService } from "./s3-upload.service"

const uploadService = new UploadService()
const s3UploadService = new S3UploadService()

export const uploadController = new Hono()

uploadController.put("/", async (c) => {
  const contentRange = c.req.header("content-range")
  const fileName = c.req.header("x-file-name")
  const uploadId = c.req.header("x-upload-id")

  if (!contentRange) {
    return c.text("Missing Content-Range header", 400)
  }
  if (!fileName) {
    return c.text("Missing x-file-name header", 400)
  }
  if (!uploadId) {
    return c.text("Missing x-upload-id header", 400)
  }

  const match = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/)
  if (!match) {
    return c.text("Invalid Content-Range format", 400)
  }

  const start = parseInt(match[1]!)
  const end = parseInt(match[2]!)
  const total = parseInt(match[3]!)

  try {
    const arrayBuffer = await c.req.arrayBuffer()
    await uploadService.handleChunk(
      fileName,
      uploadId,
      start,
      end,
      total,
      arrayBuffer,
    )
    return c.json({ success: true })
  } catch (err) {
    console.error(err)
    return c.text("Internal Server Error", 500)
  }
})

uploadController.put("/s3", async (c) => {
  const contentRange = c.req.header("content-range")
  const fileName = c.req.header("x-file-name")
  const uploadId = c.req.header("x-upload-id")

  if (!contentRange) {
    return c.text("Missing Content-Range header", 400)
  }
  if (!fileName) {
    return c.text("Missing x-file-name header", 400)
  }
  if (!uploadId) {
    return c.text("Missing x-upload-id header", 400)
  }

  const match = contentRange.match(/bytes (\d+)-(\d+)\/(\d+)/)
  if (!match) {
    return c.text("Invalid Content-Range format", 400)
  }

  const start = parseInt(match[1]!)
  const end = parseInt(match[2]!)
  const total = parseInt(match[3]!)

  try {
    const arrayBuffer = await c.req.arrayBuffer()
    await s3UploadService.handleChunk(
      fileName,
      uploadId,
      start,
      end,
      total,
      arrayBuffer,
    )
    return c.json({ success: true })
  } catch (err) {
    console.error(err)
    return c.text("Internal Server Error", 500)
  }
})
