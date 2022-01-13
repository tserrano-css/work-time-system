import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /*
  // Esta funcion es opcional y no hace falta poner-la, pero se puede usar si se quiere validar alguna
  //cosa antes que se valide el token
  //console.log('antes');
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  //Esta funcion tambien es opcional y no hace falta poner-la, pero se puede poner para validar alguna
  //cosa despúes de validar el token
  handleRequest(err, user, info) {
    // You can throw exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
  */
}
