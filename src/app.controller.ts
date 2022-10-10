import {
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
    UseInterceptors
} from '@nestjs/common'
import { AppService } from '@src/app.service'
import { AuthService } from '@src/auth/auth.service'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { LocalAuthGuard } from '@src/auth/local-auth.guard'
import { AuditInterceptor } from './logging/audit.interceptor'

@Controller()
export class AppController {
    constructor(private authService: AuthService, private appService: AppService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    // Do not audit or log the body of this call. Contains user credentials
    async login(@Request() req: any) {
        // TODO - Fix explicit any
        return this.authService.login(req.user) // user comes from local strategy validate()
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AuditInterceptor)
    @Get('profile')
    getProfile(@Request() req: any) {
        // TODO - Fix explicit any
        return req.user // user comes from jwt strategy validate()
    }

    @Get('ping')
    async ping() {
        return this.appService.getPong()
    }
}

// Authentication flow
// User hits /auth/login endpoint, annotated with LocalAuthGuard
// LocalAuthGuard invokes local passport strategy. By default, local strategy checks body has user.username and user.password. Passes this to validate()
// Custom validate() method invokes auth service to check that username and password match a user.
// Return of validate is added as a user property to the request.
// Route then calls AuthService.login() with user, which returns a signed jwt.
// Controller returns signed jwt to client

// User hits /profile endpoint, which is annotated with JwtGuard
// JwtGuard invokes jwt strategy. By default, jwt strategy validates jwt. Passes valid jwt to validate()
// Custom validate() method returns user object with userId and username. User added to request.
// profile returns user to client.
