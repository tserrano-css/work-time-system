import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { WorkTimeLogsService } from 'src/work-time-logs/work-time-logs.service';
import { TotalTimeLog } from './entities/total-time-log.entity';

@Injectable()
export class TotalTimeLogsService {
  constructor(private readonly workTimeLogService: WorkTimeLogsService) {}

  async findAll(authUser: User) {
    const workTimeLogs = await this.workTimeLogService.findAll(authUser);
    const map = new Map<string, TotalTimeLog>();

    workTimeLogs.forEach((workTimeLogs) => {
      const project = workTimeLogs.project;
      const projectKey = project.key;
      const exist = map.get(projectKey);

      if (exist) {
        exist.totalHours = exist.totalHours + workTimeLogs.hours;
        map.set(projectKey, exist);
        return;
      }

      const totalTimeReport: TotalTimeLog = {
        id: projectKey,
        user: workTimeLogs.user,
        project: workTimeLogs.project,
        totalHours: workTimeLogs.hours,
      };
      map.set(projectKey, totalTimeReport);
    });

    return [...map.values()] as TotalTimeLog[];
  }
}
