import { Module } from '@nestjs/common'
import { AuditRepository } from '@src/audit/audit.repository'
import { AuditService } from '@src/audit/audit.service'
import { TagController } from '@src/tag/tag.controller'
import { TagRepository } from '@src/tag/tag.repository'
import { TagService } from '@src/tag/tag.service'

@Module({
    imports: [],
    providers: [
        TagService,
        TagRepository,
        AuditService, // Include AuditService at app module level to be available to AuditInterceptor
        AuditRepository // Include AuditRepository at app module level to be available to AuditInterceptor
    ],
    controllers: [TagController]
})
export class TagModule {}
