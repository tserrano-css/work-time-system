import { Exclude } from 'class-transformer';
import { WorkTimeLog } from '../../work-time-logs/entities/work-time-log.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserResponseDto } from '../dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { UserProfile } from './user-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Exclude() //Necesita @UseInterceptors(ClassSerializerInterceptor) en el controlador para no devolver el password
  @Column({ type: 'varchar', select: false }) //otra manera de no devolver el password es con "select: false"
  password: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @OneToOne(() => UserProfile, (profile) => profile.user, { eager: true })
  profile: UserProfile;

  @OneToMany(() => WorkTimeLog, (workTimeLog) => workTimeLog.user)
  workTimeLogs?: WorkTimeLog[];

  @BeforeInsert()
  async processPassword() {
    if (!this.password) {
      return;
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullname: user.profile
        ? `${user.profile.name} ${user.profile.lastName}`
        : null,
      technologies: user.profile ? user.profile.technologies : null,
      /*lastname: user.lastName,
      name: user.name,*/
    };
  }
}
