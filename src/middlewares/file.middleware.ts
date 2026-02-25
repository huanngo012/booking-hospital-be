import multer from 'multer'
import { BadRequestError } from '~/core/error.response'

const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new BadRequestError('Invalid file type'))
    }

    cb(null, true)
  }
})
