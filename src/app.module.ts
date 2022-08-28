import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Tag } from './tag/tag.entity';
import { TagModule } from './tag/tag.module';
import { UserModule } from './users/user.module';

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
        entities: [Tag],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
