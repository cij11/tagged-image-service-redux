import { Injectable } from '@nestjs/common'
import { Tag } from '@src/entity/tag.entity'
import { DataSource } from 'typeorm'

@Injectable()
export class TagRepository {
    constructor(private dataSource: DataSource) {}

    async findAll() {
        const repo = this.dataSource.getRepository(Tag)

        return repo.find()
    }

    async create(requestTag: Tag) {
        const repo = this.dataSource.getRepository(Tag)

        const createdTag = repo.create(requestTag)

        return repo.save(createdTag)
    }
}
