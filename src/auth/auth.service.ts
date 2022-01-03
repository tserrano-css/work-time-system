import { Injectable } from '@nestjs/common';
import { CreateUserAccountDto } from 'src/users/dto/create-user-account.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersServices: UsersService) {}

  async create(dto: CreateUserAccountDto): Promise<User> {
    return await this.usersServices.create(dto);
  }
}
