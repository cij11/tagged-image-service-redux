import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1661678390623 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE user (
                    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
                    username varchar(255),
                    password_bcrypt char(60)
                );`
        )
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE user')
    }
}
