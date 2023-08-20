import express from "express"
import cluster from "cluster"
import os from "os"
import fs from "fs"
import morgan from "morgan"

const app = express()
const port = process.env.PORT || 3000

//---------------- Middlewares api -------------------
import cbsRouter from "./api/CBS/cbs"

// Middleware Start
const date = new Date()
const logdate = date.toISOString().slice(0, 10).replace(/-/g, "")

const logFile = fs.createWriteStream(`./Log/router_log_${logdate}.log`, {
  flags: "a",
})
app.use(morgan("combined", { stream: logFile }))
// Middleware End

// Router Start
app.use("/v1/cbs", cbsRouter)
// Router End

// 404 boundary
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found")
})

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
  // If this is the primary process, fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
    // Fork a new worker if a worker dies
    cluster.fork()
  })
} else {
  app.listen(port, () => {
    console.log(`Server is running on port ${port} Process id ${process.pid}`)
  })
}
