import { join } from "node:path"
import { open } from "node:fs/promises"
import { existsSync, mkdirSync } from "node:fs"

export class UploadService {
  private uploadDir: string

  constructor() {
    this.uploadDir = join(process.cwd(), "uploads")
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir)
    }
  }

  async handleChunk(
    fileName: string,
    uploadId: string,
    start: number,
    end: number,
    total: number,
    data: ArrayBuffer,
  ): Promise<void> {
    const safeFileName = `${uploadId}__${fileName}`
    const filePath = join(this.uploadDir, safeFileName)
    let fileHandle

    try {
      const flags = start === 0 ? "w+" : "r+"

      try {
        fileHandle = await open(filePath, flags)
      } catch (error: any) {
        if (error.code === "ENOENT") {
          fileHandle = await open(filePath, "w+")
        } else {
          throw error
        }
      }

      const buffer = new Uint8Array(data)
      await fileHandle.write(buffer, 0, buffer.length, start)

      if (end + 1 === total) {
        console.log(`Upload complete for ${fileName}`)
      }
    } finally {
      await fileHandle?.close()
    }
  }
}
