import cloudinary from '~/config/cloudinary'

const ImageService = {
  uploadSingle: async (file: string, folder: string) => {
    console.log(file)
    const { secure_url, public_id } = await cloudinary.uploader.upload(file, {
      folder
    })

    return {
      url: secure_url,
      public_id
    }
  },

  uploadMultiple: async (files: string[], folder: string) => {
    const uploads = files.map((file) => cloudinary.uploader.upload(file, { folder }))

    const results = await Promise.all(uploads)

    return results.map((item) => ({
      url: item.secure_url,
      public_id: item.public_id
    }))
  },

  deleteByPublicId: async (publicId: string) => {
    return cloudinary.uploader.destroy(publicId)
  },

  deleteMultiple: async (publicIds: string[]) => {
    return Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)))
  }
}

export default ImageService
