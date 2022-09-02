import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientUserChrisJolly1662086581411
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const saltRounds = 10;
    const clientUsername = process.env.CLIENT_USERNAME;
    const plainTextClientPassword = process.env.CLIENT_PASSWORD;

    const hash = bcrypt.hashSync(plainTextClientPassword, saltRounds);

    await queryRunner.query(
      `INSERT INTO user 
      (id, username, password_bcrypt)
       values (default, "${clientUsername}", "${hash}") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM TABLE USER were username = "chris.jolly" ',
    );
  }
}
