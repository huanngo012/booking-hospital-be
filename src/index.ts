import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/database'
dotenv.config()

const app = express()

const port = process.env.PORT || 8888

dbConnect()

app.listen(port, () => {
  console.log('Server running on the port: ' + port)
})
