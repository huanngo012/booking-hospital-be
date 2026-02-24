import multer from 'multer'
import createError from 'http-errors'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(createError(400, 'Invalid file type'))
    }

    cb(null, true)
  }
})
