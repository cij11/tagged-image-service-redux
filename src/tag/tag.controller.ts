import { Body, Controller, Get, Post } from '@nestjs/common'
import { Tag } from '@src/entity/tag.entity'
import { TagService } from '@src/tag/tag.service'

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    findAll(): Promise<Tag[]> {
        return this.tagService.findAll()
    }

    @Post()
    async create(@Body() tag: Tag) {
        return this.tagService.create(tag)
    }
}
