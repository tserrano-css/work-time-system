import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserAccountDto } from 'src/users/dto/create-user-account.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/account')
  async createUserAccount(
    @Body() dto: CreateUserAccountDto,
  ): Promise<UserResponseDto> {
    const user = await this.authService.create(dto);
    return User.toDto(user);
  }
}
