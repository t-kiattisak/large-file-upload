import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { uploadController } from "./src/features/upload/upload.controller"

const app = new Elysia()
  .use(cors())
  .use(uploadController)
  .get("/", () => "Upload Server Running")
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
