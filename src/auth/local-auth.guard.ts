import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
// passport-local strategy has default name of 'local'
// Encapsulate magic string 'local' here, rather than providing string to decorator each time it's used
