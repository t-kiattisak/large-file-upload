import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { uploadController } from "./src/features/upload/upload.controller"

const app = new Hono()

app.use("/*", cors())
app.route("/upload", uploadController)

app.get("/", (c) => c.text("Upload Server Running"))

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
