import 'dotenv/config';
import { DataSource } from 'typeorm';

console.log('Starting migration');

// Migrations are not currently integrated with NestJs. Migrations currently require their own data source configuration
export const migrationDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number.parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_SERVICE_USERNAME,
  password: process.env.SERVICE_USER_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [__dirname + '../entity/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  logging: false,
  synchronize: false,
  timezone: 'Z',
});
