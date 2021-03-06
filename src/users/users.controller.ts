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
  Version,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/common/auth-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorators';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/common/roles.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
//import * as fs from 'fs';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller({
  path: 'users',
  //version: '1', //Se puede especificar a nivel de controlador o de metodo
})
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Version('1') //Versionado a nivel de metodo
  @Get()
  @Roles(Role.Admin) //Validación de roles con el metodo de RBAC
  async findAllv1(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Version(['2', '3']) //Versionado a nivel de metodo
  @Get()
  @Roles(Role.Admin) //Validación de roles con el metodo de RBAC
  async findAllv2(): Promise<UserResponseDto[]> {
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

  @Post(':username/profile-picture')
  @UseInterceptors(
    //FileInterceptor('file') //Una manera

    //otra manera
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
      }),
    }),
  )
  uploadPicture(@UploadedFile() file: Express.Multer.File) {
    //Se necesita la libreria multer de nest. Mirar doc de Nest
    console.log(file);
    // implementación de storage del fichero. Tendria que estar en el servicio.
    // fs.writeFileSync('new-image.png', file.buffer.toString());
  }
}
