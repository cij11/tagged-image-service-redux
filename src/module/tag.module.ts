import { Module } from '@nestjs/common';
import { TagRepository } from 'src/repository/tag.repository';
import { TagController } from '../controller/tag.controller';
import { TagService } from '../service/tag.service';

@Module({
  imports: [],
  providers: [TagService, TagRepository],
  controllers: [TagController],
})
export class TagModule {}
