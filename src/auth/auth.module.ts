import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from '@src/auth/auth.service'
import { JwtStrategy } from '@src/auth/jwt.strategy'
import { LocalStrategy } from '@src/auth/local.strategy'
import { UserModule } from '@src/user/user.module'

@Module({
    imports: [
        ConfigModule.forRoot(),
        UserModule,
        PassportModule,
        // JwtModule Lets application use JwtService
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '60s' }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
