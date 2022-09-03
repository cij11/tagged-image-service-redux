import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { User } from '../entity/user.entity'

@Injectable()
export class UserRepository {
    constructor(private dataSource: DataSource) {}

    async findUser(username: string): Promise<User | null> {
        const repo = this.dataSource.getRepository(User)

        return repo.findOneBy({
            username
        })
    }
}
