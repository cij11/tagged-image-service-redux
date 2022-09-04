import { Injectable } from '@nestjs/common'
import { User } from '@src/entity/user.entity'
import { UserRepository } from '@src/user/user.repository'

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async findUser(username: string): Promise<User> {
        return this.userRepository.findUser(username)
    }
}
