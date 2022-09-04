import { Injectable } from '@nestjs/common'
import { Tag } from '@src/entity/tag.entity'
import { DataSource } from 'typeorm'

@Injectable()
export class TagRepository {
    constructor(private dataSource: DataSource) {}

    async getTags() {
        const repo = this.dataSource.getRepository(Tag)

        return repo.find()
    }

    async createTag(requestTag: Tag) {
        const repo = this.dataSource.getRepository(Tag)

        const createdTag = repo.create(requestTag)

        return repo.save(createdTag)
    }
}
