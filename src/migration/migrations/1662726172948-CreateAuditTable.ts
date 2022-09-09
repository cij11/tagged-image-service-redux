import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAuditTable1662726172948 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE audit (
                    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
                    userId int,
                    method varchar(8),
                    url text,
                    body json,
                    statusCode int
                );`
        )
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE audit')
    }
}
