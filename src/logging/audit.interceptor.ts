import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common'
import { AuditService } from '@src/audit/audit.service'
import { Observable, tap } from 'rxjs'

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private auditService: AuditService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap((next) => {
                const response = context.switchToHttp().getResponse()
                const request = context.switchToHttp().getRequest()

                const { statusCode } = response
                const { user, body, method, url } = request
                const { userId, username } = user

                if (request.file) {
                    body.filename = request.file.originalname
                }

                const audit = {
                    statusCode,
                    userId,
                    body,
                    url,
                    method
                }

                this.auditService.create(audit)
                console.log(
                    `Wrote audit log for request from user ${username} `,
                    JSON.stringify(audit)
                )
            })
        )
    }
}
