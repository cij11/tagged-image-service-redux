import { Injectable } from '@nestjs/common'
import { Tag } from '@src/entity/tag.entity'
import { TagRepository } from '@src/tag/tag.repository'

@Injectable()
export class TagService {
    constructor(private tagRepository: TagRepository) {}

    findAll(): Promise<Tag[]> {
        return this.tagRepository.getTags()
    }

    async create(tag: Tag) {
        return this.tagRepository.createTag(tag)
    }
}
