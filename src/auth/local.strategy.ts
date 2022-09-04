import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '@src/auth/auth.service'
import { Strategy } from 'passport-local'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super() // No configuration options, so call super without arguments. _Could_ provide a new mapping, instead of default username and password fields
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password)
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}
