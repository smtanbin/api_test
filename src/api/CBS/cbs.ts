import express from "express"
const cbsRouter = express.Router()

cbsRouter.get("/", async (req, res) => {
  const resData: { message: any; error: undefined | String } = {
    message: undefined,
    error: undefined,
  }
  try {
    resData.message = "test this is cbs" // Fixed this line
    res.send(resData)
  } catch (error: any) {
    const err = new Error(error)
    resData.error = err.message.toString() // Fixed this line
    res.send(resData.error)
  }
})

export default cbsRouter // Don't forget to export the router
