import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from 'src/user/user.service'
import { AuthService } from '../../../src/auth/auth.service'

describe('AuthService', () => {
    let service: AuthService

    let userService: UserService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, UserService, JwtService]
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
