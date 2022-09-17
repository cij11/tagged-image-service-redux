import { StreamableFile } from '@nestjs/common'
import { Image } from '@src/entity/image.entity'
import { ImageController } from '@src/image/image.controller'
import { ImageService } from '@src/image/image.service'
import { MimeType } from '@src/type/mime-type.type'
import * as sinon from 'sinon'

describe('ImageController.findOne', () => {
    const expectedImage: Image = {
        id: 1,
        filename: 'test.jpg',
        createdAt: new Date(),
        modifiedAt: new Date(),
        tags: []
    }

    it('should fetch an image model by id, when called with the application/json content type', async () => {
        // Given
        const imageService = sinon.createStubInstance(ImageService)
        imageService.getImageModel.resolves(expectedImage)

        const modelHeaders: Record<string, string> = {
            'content-type': MimeType.ApplicationJson
        }

        const sut = new ImageController(imageService)

        // When
        const actualImage = await sut.findOne('1', modelHeaders)

        // Then
        expect(actualImage).toBe(expectedImage)
        expect(imageService.getImageModel.calledOnceWithExactly(1)).toBeTruthy()
    })

    it('should fetch an image streamable file by id, when called with the image content type', async () => {
        // Given
        const expectedStreamableFile = sinon.createStubInstance(StreamableFile)
        const streamableFileHeaders: Record<string, string> = {
            'content-type': MimeType.Image
        }

        const imageService = sinon.createStubInstance(ImageService)
        imageService.getImageModel.resolves(expectedImage)
        imageService.getImageStreamableFile.resolves(expectedStreamableFile)

        const sut = new ImageController(imageService)

        // When
        const actualStreamableFile = await sut.findOne(
            '1',
            streamableFileHeaders
        )

        // Then
        expect(actualStreamableFile).toBe(expectedStreamableFile)
        expect(
            imageService.getImageStreamableFile.calledOnceWithExactly(1)
        ).toBeTruthy()
    })

    it('should return an error, if no supported content-type header is provided', async () => {
        // Given
        const unsupportedContentTypeHeaders: Record<string, string> = {
            'content-type': 'unsupported-asdf'
        }

        const imageService = sinon.createStubInstance(ImageService)

        const sut = new ImageController(imageService)

        // When + Then
        await expect(
            sut.findOne('1', unsupportedContentTypeHeaders)
        ).rejects.toThrow(
            "Get image supports content-type of 'application/json' or 'image"
        )
    })
})

describe('ImageController.create', () => {
    const expectedImageModel: Image = {
        id: 1,
        filename: 'test.jpg',
        createdAt: new Date(),
        modifiedAt: new Date(),
        tags: []
    }

    it('should create image model via ImageService', async () => {
        // Given
        const imageService = sinon.createStubInstance(ImageService)
        const file: Express.Multer.File = {
            fieldname: '',
            encoding: '',
            originalname: 'test.jpg',
            filename: 'test.jpg',
            mimetype: '',
            size: 10,
            stream: null,
            buffer: null,
            destination: '',
            path: ''
        }
        imageService.createImage.resolves(expectedImageModel)

        const sut = new ImageController(imageService)

        // When
        const actualImageModel = await sut.create(file)

        // Then
        expect(actualImageModel).toBe(expectedImageModel)
        expect(
            imageService.createImage.calledOnceWithExactly(file)
        ).toBeTruthy()
    })
})

describe('ImageController.patch', () => {
    const expectedImageModel: Image = {
        id: 1,
        filename: 'test.jpg',
        createdAt: new Date(),
        modifiedAt: new Date(),
        tags: [
            {
                id: 1,
                text: 'test_text'
            }
        ]
    }

    it('should update the image via ImageService', async () => {
        // Given
        const imageService = sinon.createStubInstance(ImageService)
        imageService.updateImage.resolves(expectedImageModel)

        const sut = new ImageController(imageService)

        // When
        const actualImageModel = await sut.patch('1', expectedImageModel)

        // Then
        expect(actualImageModel).toBe(expectedImageModel)
        expect(
            imageService.updateImage.calledOnceWithExactly(
                1,
                expectedImageModel
            )
        ).toBeTruthy()
    })
})
