import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  //importo la estrategy de passport-local

  constructor(private authService: AuthService) {
    // le pasamos los nombres de los campos que vamos a usar para nombre de usuario y contraña,
    // si no se pasan en el super() se usan por defecto username y password
    super({
      usernameField: 'username', //default: username
      passwordField: 'password', //default: password
    });
  }

  // este metodo esta definido en local-strategy
  async validate(username: string, password: string): Promise<any> {
    const user: User = await this.authService.validateLoginCredentials(
      username,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
