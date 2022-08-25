import { Injectable } from '@nestjs/common';
import { TagRepository } from 'src/repository/tag.repository';
import { Tag } from '../entity/tag.entity';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  findAll(): Promise<Tag[]> {
    return this.tagRepository.getTags();
  }

  async create(tag: Tag) {
    return this.tagRepository.createTag(tag);
  }
}
