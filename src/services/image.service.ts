import cloudinary from '~/config/cloudinary'

const ImageService = {
  uploadSingle: async (file: Express.Multer.File, folder: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image'
        },
        (error, result) => {
          if (error) return reject(error)
          if (!result?.secure_url) return reject(new Error('Upload failed'))

          resolve(result.secure_url)
        }
      )

      stream.end(file.buffer)
    })
  },

  uploadMultiple: async (files: Express.Multer.File[], folder: string): Promise<string[]> => {
    const uploads = files.map((file) => ImageService.uploadSingle(file, folder))

    return Promise.all(uploads)
  },

  deleteByPublicId: async (publicId: string) => {
    return cloudinary.uploader.destroy(publicId)
  },

  deleteMultiple: async (publicIds: string[]) => {
    return cloudinary.api.delete_resources(publicIds)
  }
}

export default ImageService
