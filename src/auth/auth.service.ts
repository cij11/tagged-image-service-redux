import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@src/user/user.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async validateUser(
        username: string,
        pass: string
    ): Promise<AuthenticatedUser | null> {
        const user = await this.userService.findUser(username)

        if (user) {
            const userValid = await bcrypt.compare(pass, user.password_bcrypt)

            if (userValid) {
                return {
                    userId: user.id,
                    username: user.username
                }
            }
        }

        return null
    }

    // Because of the AuthGuard on auth/login, the route handler will only be invoked if the user has been validated.
    // The same AuthGuard will ensure the request has a 'user' attribute
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
