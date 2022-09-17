import { Injectable } from '@nestjs/common'
import { Image } from '@src/entity/image.entity'
import { ImageFilterRequest } from '@src/type/image-filter-request.type'
import { ImageRepository } from './image.repository'

@Injectable()
export class ImageService {
    constructor(private imageRepository: ImageRepository) {}

    async getImageModel(imageId: number) {
        return this.imageRepository.findOne(imageId)
    }

    async getImageStreamableFile(imageId: number) {
        const imageModel = await this.imageRepository.findOne(imageId)

        return this.imageRepository.retrieve(imageModel.filename)
    }

    async createImage(file: Express.Multer.File) {
        const filename = file.originalname

        this.imageRepository.store(file)

        const image: Image = {
            filename: filename,
            tags: [],
            createdAt: new Date(),
            modifiedAt: new Date()
        }

        return this.imageRepository.create(image)
    }

    async filterImages(imageFilterRequest: ImageFilterRequest) {
        return this.imageRepository.search(imageFilterRequest)
    }

    async updateImage(imageId: number, image: Image) {
        return this.imageRepository.update(imageId, image)
    }
}
