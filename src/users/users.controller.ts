import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/common/auth-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorators';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/common/roles.guard';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin) //Validación de roles con el metodo de RBAC
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    const res = users.map((user) => User.toDto(user));
    return res;
  }

  @Get(':username')
  async findOne(
    @Param('username') username: string,
    @AuthUser() authUser: User,
  ) {
    const user = await this.usersService.findOneByUserName(username, authUser);
    return User.toDto(user);
  }

  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: User,
  ) {
    return this.usersService.update(username, updateUserDto, authUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
