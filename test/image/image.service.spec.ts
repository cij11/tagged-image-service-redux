import { StreamableFile } from '@nestjs/common'
import { Image } from '@src/entity/image.entity'
import { ImageRepository } from '@src/image/image.repository'
import { ImageService } from '@src/image/image.service'
import * as sinon from 'sinon'

describe('ImageService.getImageModel', () => {
    const expectedImageModel: Image = {
        id: 1,
        filename: 'test.jpg',
        createdAt: new Date(),
        modifiedAt: new Date(),
        tags: []
    }

    it('should request image model by id from ImageRepository', async () => {
        // Given
        const imageRepository = sinon.createStubInstance(ImageRepository)
        imageRepository.findOne.resolves(expectedImageModel)

        const sut = new ImageService(imageRepository)

        // When
        const actualImageModel = await sut.getImageModel(1)

        // Then
        expect(actualImageModel).toBe(expectedImageModel)
        expect(imageRepository.findOne.calledOnceWithExactly(1)).toBeTruthy()
    })
})

describe('TagService.getImageStreamableFile', () => {
    const expectedImageModel: Image = {
        id: 1,
        filename: 'test.jpg',
        createdAt: new Date(),
        modifiedAt: new Date(),
        tags: []
    }

    it('should load model from image repository, and use that model to stream a file from disk to the client', async () => {
        // Given
        const imageRepository = sinon.createStubInstance(ImageRepository)
        const expectedStreamableFile = sinon.createStubInstance(StreamableFile)

        imageRepository.findOne.resolves(expectedImageModel)
        imageRepository.retrieve.resolves(expectedStreamableFile)

        const sut = new ImageService(imageRepository)

        // When
        const actualStreamableFile = await sut.getImageStreamableFile(1)

        // Then
        expect(actualStreamableFile).toBe(expectedStreamableFile)
        expect(imageRepository.findOne.calledOnceWithExactly(1)).toBeTruthy()
        expect(
            imageRepository.retrieve.calledOnceWithExactly(
                expectedImageModel.filename
            )
        ).toBeTruthy()
    })
})

describe('TagService.updateImage', () => {
    const expectedImageModel: Image = {
        id: 1,
        filename: 'test.jpg',
        createdAt: new Date(),
        modifiedAt: new Date(),
        tags: []
    }

    it('should update image model via ImageRepository', async () => {
        const imageRepository = sinon.createStubInstance(ImageRepository)
        imageRepository.update.resolves(expectedImageModel)

        const sut = new ImageService(imageRepository)

        // When
        const actualImageModel = await sut.updateImage(1, expectedImageModel)

        // Then
        expect(actualImageModel).toBe(expectedImageModel)
        expect(
            imageRepository.update.calledOnceWithExactly(1, expectedImageModel)
        ).toBeTruthy()
    })
})
