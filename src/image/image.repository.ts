import { Injectable, StreamableFile } from '@nestjs/common'
import { Image } from '@src/entity/image.entity'
import { ImageFilterRequest } from '@src/type/image-filter-request.type'
import { createReadStream, createWriteStream } from 'fs'
import { DataSource } from 'typeorm'

@Injectable()
export class ImageRepository {
    constructor(private dataSource: DataSource) {}

    async findOne(imageId: number) {
        const repo = this.dataSource.getRepository(Image)

        return repo.findOneBy({ id: imageId })
    }

    async search(imageFilterRequest?: ImageFilterRequest) {
        const repo = this.dataSource.getRepository(Image)

        const query = repo
            .createQueryBuilder('image')
            .leftJoinAndSelect('image.tags', 'tag')

        if (!imageFilterRequest) {
            return query.getMany()
        }

        if (imageFilterRequest.tagIds) {
            const tagIdsJoined = imageFilterRequest.tagIds.join(',')

            query.andWhere(
                'image.id IN ' +
                    query
                        .subQuery() // Subquery to select imageIds that have a relationship with any of the given tagIds
                        .select('imageSub.id')
                        .from(Image, 'imageSub')
                        .innerJoin('imageSub.tags', 'tagSub')
                        .where(`tagSub.id IN (${tagIdsJoined})`) // TODO. Investigate why this fails when using the format: .where(`tag2.id IN (:tagIdsJoined})`, {tagIdsJoined})
                        .getQuery()
            )
        }

        if (imageFilterRequest.createdAtFrom) {
            query.andWhere('image.createdAt >= :createdAtFrom', {
                createdAtFrom: imageFilterRequest.createdAtFrom
            })
        }

        if (imageFilterRequest.createdAtFrom) {
            query.andWhere('image.createdAt <= :createdAtTo', {
                createdAtTo: imageFilterRequest.createdAtTo
            })
        }

        return query.getMany()
    }

    async create(requestImage: Image) {
        const repo = this.dataSource.getRepository(Image)

        const createdImage = repo.create(requestImage)

        return repo.save(createdImage)
    }

    async store(file: Express.Multer.File) {
        const ws = createWriteStream(
            `${__dirname}/../../public/${file.originalname}`
        )
        ws.write(file.buffer)
        console.log(file)
    }

    async retrieve(filename: string) {
        const path = `${__dirname}/../../public/${filename}`
        const imageFile = createReadStream(path)
        return new StreamableFile(imageFile)
    }

    async update(imageId: number, requestImage: Image) {
        const repo = this.dataSource.getRepository(Image)

        // Need to request image before update, as need to set every field of the image with a
        // repo.save() call. repo.update() can update subset of fields only so would not require
        // loading model, but does not work with models with relationships
        const storedImage = await repo.findOneBy({
            id: imageId
        })

        const updatedImage = repo.create({
            ...storedImage,
            ...requestImage,
            modifiedAt: new Date()
        })

        await repo.save(updatedImage)

        // Need to request image again after save. Collection returned from save(updatedImage) does not
        // include full tag models, only the id field of tags
        return repo.findOneBy({ id: imageId })
    }
}
