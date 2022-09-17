import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Patch,
    Post,
    Query,
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
import { ImageFilterRequest } from '@src/type/image-filter-request.type'
import { MimeType } from '@src/type/mime-type.type'

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @Param('id') id: string,
        @Headers() headers: Record<string, string>
    ): Promise<Image | StreamableFile> {
        try {
            const contentType = headers['content-type']

            switch (contentType) {
                case MimeType.ApplicationJson: {
                    console.log('Content-type application/json requested')
                    return this.imageService.getImageModel(Number.parseInt(id))
                }
                case MimeType.Image: {
                    console.log('Content-Type image requested')

                    return this.imageService.getImageStreamableFile(
                        Number.parseInt(id)
                    )
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
    search(@Query('filter') filter: ImageFilterRequest): Promise<Image[]> {
        return this.imageService.filterImages(filter)
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
