import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common'
import { IncomingMessage } from 'http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const incomingMessage: any = context.getArgByIndex<IncomingMessage>(0)
        if (incomingMessage) {
            const username =
                incomingMessage.user.username ?? 'no_user_authenticated'
            console.log(
                `Received '${incomingMessage.method}' to url '${incomingMessage.url}' as user '${username}'`
            )
        }
        const now = Date.now()
        return next
            .handle()
            .pipe(
                tap(() =>
                    console.log(`Request duration... ${Date.now() - now}ms`)
                )
            )
    }
}
