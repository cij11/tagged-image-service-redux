import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// Endpoints annotated with JwtAuthGuard will use jwt passport strategy.
// jwt will be validated, and a user attribute will be added to the request passed on to the route.
// The user will be the object returned from the strategy's validate() method
