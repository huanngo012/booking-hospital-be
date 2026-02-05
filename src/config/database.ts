import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

const dbConnect = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string)

    if (conn.connection.readyState === 1) {
      console.log('DB connection is successful')
    } else {
      console.log('DB is connecting...')
    }
  } catch (error) {
    console.error('DB connection failed', error)
    process.exit(1)
  }
}

export default dbConnect
