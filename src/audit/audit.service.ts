import { Injectable } from '@nestjs/common'
import { Audit } from '@src/entity/audit.entity'
import { AuditRepository } from './audit.repository'

@Injectable()
export class AuditService {
    constructor(private auditRepository: AuditRepository) {}

    test() {
        console.log('audit service test hit')
    }

    async create(audit: Audit) {
        return this.auditRepository.createAudit(audit)
    }
}
