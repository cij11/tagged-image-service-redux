import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { Tag } from '@src/entity/tag.entity'
import { AuditInterceptor } from '@src/logging/audit.interceptor'
import { TagService } from '@src/tag/tag.service'

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(): Promise<Tag[]> {
        return this.tagService.findAll()
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuditInterceptor)
    async create(@Body() tag: Tag) {
        return this.tagService.create(tag)
    }
}
