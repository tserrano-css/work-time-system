import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/account')
  async createUserAccount(): Promise<User> {
    return null;
  }
}
