import { Module } from '@nestjs/common'
import { AuditRepository } from '@src/audit/audit.repository'
import { AuditService } from '@src/audit/audit.service'
import { ImageController } from './image.controller'
import { ImageRepository } from './image.repository'
import { ImageService } from './image.service'

@Module({
    imports: [],
    providers: [
        ImageService,
        ImageRepository,
        AuditService, // Include AuditService at app module level to be available to AuditInterceptor
        AuditRepository // Include AuditRepository at app module level to be available to AuditInterceptor
    ],
    controllers: [ImageController]
})
export class ImageModule {}
