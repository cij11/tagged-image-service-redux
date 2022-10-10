import * as bcrypt from 'bcrypt'
import 'dotenv/config'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { SALT_ROUNDS } from '../../auth/auth.constants'

export class CreateClientUserChrisJolly1662086581411
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        const clientUsername = process.env.CLIENT_USERNAME
        const plainTextClientPassword = process.env.CLIENT_PASSWORD

        const hash = bcrypt.hashSync(plainTextClientPassword, SALT_ROUNDS)

        await queryRunner.query(
            `INSERT INTO user
      (id, username, password_bcrypt)
       values (default, "${clientUsername}", "$2b$10$BVGXVvjSgqHxUVbMPEGoCemMg8nFsjf.IxXpCrQdPEf2gmzu.zugW")` // TODO: Fix bug where interpolating hash variable here results in hash not being written to db
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM TABLE USER were username = "chris.jolly" '
        )
    }
}
