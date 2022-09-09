import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { AuditRepository } from '@src/audit/audit.repository'
import { AuditService } from '@src/audit/audit.service'
import { AuthModule } from '@src/auth/auth.module'
import { Audit } from '@src/entity/audit.entity'
import { Image } from '@src/entity/image.entity'
import { Tag } from '@src/entity/tag.entity'
import { User } from '@src/entity/user.entity'
import { migrationDataSource } from '@src/migration/migration-data-source'
import { TagModule } from '@src/tag/tag.module'
import { UserModule } from '@src/user/user.module'

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
        AuditService, // Include AuditService at app module level to be available to AuditInterceptor
        AuditRepository // Include AuditRepository at app module level to be available to AuditInterceptor
    ]
})
export class AppModule {}
