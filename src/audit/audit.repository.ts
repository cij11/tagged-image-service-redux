import { Injectable } from '@nestjs/common'
import { Audit } from '@src/entity/audit.entity'
import { DataSource } from 'typeorm'

@Injectable()
export class AuditRepository {
    constructor(private dataSource: DataSource) {}

    async createAudit(requestAudit: Audit) {
        const repo = this.dataSource.getRepository(Audit)

        const createdAudit = repo.create(requestAudit)

        return repo.save(createdAudit)
    }
}
