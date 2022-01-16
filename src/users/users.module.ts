import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  controllers: [UsersController],
  providers: [UsersService], //provaides internos del modulo no visibles a fuera si no se ponen en el exports
  exports: [UsersService], //publico para otros modulos. Por exemplo en el auth.module se importan
})
export class UsersModule {}
