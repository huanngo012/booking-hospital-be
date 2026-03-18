import './config/env'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dbConnect from './config/database'
import routes from './routes'
import z from 'zod'
import { vi } from 'zod/locales'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

z.config(vi())

import dns from 'node:dns/promises'

dns.setServers(['1.1.1.1', '1.0.0.1'])

const app = express()

const port = process.env.PORT || 8888

dbConnect()

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.get('/', (req, res) => {
  res.send('Server is running...')
})
app.use('/api/v1', routes)

app.listen(port, () => {
  console.log('Server running on the port: ' + port)
})
