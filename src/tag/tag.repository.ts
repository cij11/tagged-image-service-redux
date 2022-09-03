import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Tag } from '../entity/tag.entity'

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
