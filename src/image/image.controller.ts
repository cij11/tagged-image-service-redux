import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Patch,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { Image } from '@src/entity/image.entity'
import { ImageService } from '@src/image/image.service'
import { AuditInterceptor } from '@src/logging/audit.interceptor'
import { MimeType } from '@src/type/mime-type.type'
import { createReadStream } from 'fs'

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @Param('id') id: string,
        @Headers() headers: Record<string, string>,
        @Res({ passthrough: true }) res: Response
    ): Promise<Image | StreamableFile> {
        try {
            const contentType = headers['content-type']

            switch (contentType) {
                case MimeType.ApplicationJson: {
                    console.log('Content-type application/json requested')
                    const imageModel = this.imageService.getImageModel(
                        Number.parseInt(id)
                    )

                    return imageModel
                }
                case MimeType.Image: {
                    console.log('Content-Type image requested')

                    const path = await this.imageService.getImageFilePath(
                        Number.parseInt(id)
                    )

                    const imageFile = createReadStream(path)
                    return new StreamableFile(imageFile)
                }
                default: {
                    throw Error(
                        "Get image supports content-type of 'application/json' or 'image"
                    )
                }
            }
        } catch (err) {
            console.error('Error while getting image', err.message)
            throw err
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    search(): Promise<Image[]> {
        return this.imageService.filterImages(null)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuditInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file: Express.Multer.File) {
        return this.imageService.createImage(file)
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuditInterceptor)
    async patch(@Param('id') id: string, @Body() image: Image) {
        return this.imageService.updateImage(Number.parseInt(id), image)
    }
}
