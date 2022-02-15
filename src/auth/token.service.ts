import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { JWTPayload } from './jwt-payload';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService, //Requiere definir el JwtModule en el authModule
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
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

  async generatePairTokens(
    user: User,
    expireRefreshTokenTimeInSec: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(
      user,
      expireRefreshTokenTimeInSec,
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async generateRefreshToken(
    user: User,
    expiresTimeSeconds: number,
  ): Promise<string> {
    const expiration = new Date();
    const expiresTimeMili = expiresTimeSeconds * 1000;
    expiration.setTime(expiration.getTime() + expiresTimeMili);

    const tempEntity = this.refreshTokenRepository.create();
    tempEntity.user = user;
    tempEntity.isRevoked = false;
    tempEntity.expires = expiration;

    const refreshTokenEntity = await this.refreshTokenRepository.save(
      tempEntity,
    );

    const opts: SignOptions = {
      expiresIn: expiresTimeSeconds,
      subject: String(user.username),
      jwtid: String(refreshTokenEntity.id),
    };

    return this.jwtService.signAsync({}, opts);
  }
}
