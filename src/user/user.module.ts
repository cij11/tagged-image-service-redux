import { Module } from '@nestjs/common'
import { UserRepository } from '@src/user/user.repository'
import { UserService } from '@src/user/user.service'

@Module({
    providers: [UserService, UserRepository],
    exports: [UserService]
})
export class UserModule {}
