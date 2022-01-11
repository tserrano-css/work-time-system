import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateWorkTimeLogDto } from './dto/create-work-time-log.dto';
import { UpdateWorkTimeLogDto } from './dto/update-work-time-log.dto';
import { WorkTimeLog } from './entities/work-time-log.entity';

@Injectable()
export class WorkTimeLogsService {
  constructor(
    @InjectRepository(WorkTimeLog)
    private readonly workTimeLogRepository: Repository<WorkTimeLog>,
  ) {}

  async create(
    createWorkTimeLogDto: CreateWorkTimeLogDto,
    user: User,
  ): Promise<WorkTimeLog> {
    const tempEntity = await this.workTimeLogRepository.create({
      ...createWorkTimeLogDto,
      user: user,
    });
    return this.workTimeLogRepository.save(tempEntity);
  }

  async findAll(authUser: User): Promise<WorkTimeLog[]> {
    return this.workTimeLogRepository.find({
      where: {
        user: {
          id: authUser.id,
        },
      },
    });
  }

  async findOne(id: string, authUser: User): Promise<WorkTimeLog> {
    const workTimeLog = await this.workTimeLogRepository.findOne({
      where: {
        id: id,
        user: {
          id: authUser.id,
        },
      },
    });

    if (!workTimeLog) {
      throw new NotFoundException();
    }

    return workTimeLog;
  }

  update(id: number, updateWorkTimeLogDto: UpdateWorkTimeLogDto) {
    return `This action updates a #${id} workTimeLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} workTimeLog`;
  }
}
