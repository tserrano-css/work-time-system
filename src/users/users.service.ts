import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/role.enum';
import { Repository } from 'typeorm';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfile } from './entities/user-profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  async create(dto: CreateUserAccountDto): Promise<User> {
    const loadedUser = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }], //esto es un OR si fuera un AND seria [{ username: dto.username, email: dto.email }]
    });

    if (loadedUser && loadedUser.username === dto.username) {
      throw new ConflictException('username is not available');
    }

    if (loadedUser && loadedUser.email === dto.email) {
      throw new ConflictException('email is not available');
    }

    const tempEntity = this.userRepository.create(dto);
    return this.userRepository.save(tempEntity);
  }

  getOneUser(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  getOneUserIncludingPass(username: string): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder('user'); //user es un alias para las consultas
    queryBuilder
      .where(`user.username ='${username}'`)
      .addSelect('user.password');

    return queryBuilder.getOne();
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['profile'],
    });
  }

  findOne(id: number) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where(`user.id = :id`, { id });
    return queryBuilder.getOne();
  }

  async findOneByUserName(username: string, authUser: User) {
    /*const user = await this.userRepository.findOne({
      username,
    });*/

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder
      .where(`user.username = :username`, { username })
      .leftJoinAndSelect('user.profile', 'profile');
    return queryBuilder.getOne();
  }

  async update(username: string, updateUserDto: UpdateUserDto, authUser: User) {
    const user = await this.userRepository.findOne({
      username,
    });

    if (!user) {
      throw new BadRequestException();
    }

    if (user.id !== authUser.id) {
      throw new UnauthorizedException();
    }

    let tempProfile = await this.profileRepository.preload({
      ...updateUserDto,
      user: user,
    });

    if (!tempProfile) {
      tempProfile = this.profileRepository.create(updateUserDto);
    }
    tempProfile.user = user;

    await this.profileRepository.save(tempProfile);

    return this.userRepository.findOne({
      where: { username },
      relations: ['profile'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
