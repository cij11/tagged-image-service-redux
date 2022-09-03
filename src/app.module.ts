import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { Image } from './entity/image.entity'
import { Tag } from './entity/tag.entity'
import { User } from './entity/user.entity'
import { migrationDataSource } from './migration/migration-data-source'
import { TagModule } from './tag/tag.module'
import { UserModule } from './user/user.module'

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
                entities: [Tag, User, Image],
                synchronize: true
            }),
            inject: [ConfigService]
        }),
        AuthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
