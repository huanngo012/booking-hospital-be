import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/database'
import routes from './routes'

dotenv.config()
const app = express()

const port = process.env.PORT || 8888

dbConnect()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running...')
})
app.use('/api/v1', routes)

app.listen(port, () => {
  console.log('Server running on the port: ' + port)
})
