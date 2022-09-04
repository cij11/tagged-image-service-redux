import { Injectable } from '@nestjs/common'
import { User } from '@src/entity/user.entity'
import { DataSource } from 'typeorm'

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
