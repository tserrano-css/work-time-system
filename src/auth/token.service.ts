import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { JWTPayload } from './jwt-payload';

@Injectable()
export class TokenService {
  constructor(
    //private readonly tokenRespository: TokenRepo,
    private readonly jwtService: JwtService, //Requiere definir el JwtModule en el authModule
  ) {}

  async generateAccessToken(user: User): Promise<string> {
    // Me genero el playload
    const payload: JWTPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    // Firmo el payload
    return this.jwtService.sign(payload);
  }
}
