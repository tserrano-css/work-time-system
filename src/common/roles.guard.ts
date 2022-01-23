import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/roles/role.enum';
import { ROLES_KEY } from 'src/roles/roles.decorators';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //esto es para obtener de los controladores los roles definidos, por ejecmplo: @Roles(Role.Admin)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), //Accepta Guard a nivel de metodo o controlador (@UseGuards(RolesGuard)) y @Roles(Role.Admin)
      context.getClass(), //I tambien a nivel de clase (@UseGuards(RolesGuard)) y @Roles(Role.Admin)
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    //console.log(user);

    //comprobamos si el usuario recibido en la request tiene el rol para ese controlador
    if (user) {
      return requiredRoles.some((role) =>
        user.roles.some((userRole) => userRole === role),
      );
      //console.log(result);
      //return result;
    }

    return true;
  }
}
