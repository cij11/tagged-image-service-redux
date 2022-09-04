import { Module } from '@nestjs/common'
import { TagController } from '@src/tag/tag.controller'
import { TagRepository } from '@src/tag/tag.repository'
import { TagService } from '@src/tag/tag.service'

@Module({
    imports: [],
    providers: [TagService, TagRepository],
    controllers: [TagController]
})
export class TagModule {}
