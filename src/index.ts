import './config/env'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dbConnect from './config/database'
import routes from './routes'
import z from 'zod'
import { vi } from 'zod/locales'

z.config(vi())

const app = express()

const port = process.env.PORT || 8888

dbConnect()

app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Server is running...')
})
app.use('/api/v1', routes)

app.listen(port, () => {
  console.log('Server running on the port: ' + port)
})
