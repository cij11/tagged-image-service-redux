import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { migrationDataSource } from '@src/migration/migration-data-source'
import { TagModule } from '@src/tag/tag.module'
import { UserModule } from '@src/user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuditRepository } from './audit/audit.repository'
import { AuditService } from './audit/audit.service'
import { AuthModule } from './auth/auth.module'
import { Audit } from './entity/audit.entity'
import { Image } from './entity/image.entity'
import { Tag } from './entity/tag.entity'
import { User } from './entity/user.entity'
import { AuditInterceptor } from './logging/audit.interceptor'

console.log(
    `Including migrationDataSource into build: ${!!migrationDataSource}`
)

@Module({
    imports: [
        ConfigModule.forRoot(),
        TagModule,
        TypeOrmModule.forRootAsync({
            // Need to instantiate TypeOrmModule asynchronously to await env variable loading
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('MYSQL_HOST'),
                port: parseInt(configService.get('MYSQL_PORT')),
                username: configService.get('MYSQL_SERVICE_USERNAME'),
                password: configService.get('SERVICE_USER_PASSWORD'),
                database: configService.get('MYSQL_DB'),
                entities: [Tag, User, Image, Audit],
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        AuthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        AuditService,
        AuditRepository,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditInterceptor
        }
    ]
})
export class AppModule {}
