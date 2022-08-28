import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

@Module({
  imports: [],
  providers: [TagService, TagRepository],
  controllers: [TagController],
})
export class TagModule {}
