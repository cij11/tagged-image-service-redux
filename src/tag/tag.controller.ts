import { Body, Controller, Get, Post } from '@nestjs/common';
import { Tag } from 'src/tag/tag.entity';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Post()
  async create(@Body() tag: Tag) {
    return this.tagService.create(tag);
  }
}
