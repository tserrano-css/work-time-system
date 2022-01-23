import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { WorkTimeLogsService } from './work-time-logs.service';
import { WorkTimeLogsController } from './work-time-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTimeLog } from './entities/work-time-log.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkTimeLog]),
    ProjectsModule,
    CacheModule.register({
      ttl: 20, //tiempo maximo de la cache 20segundos
      max: 4, //maximo número de recursos en cache
    }),
  ],
  controllers: [WorkTimeLogsController],
  providers: [
    WorkTimeLogsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [WorkTimeLogsService],
})
export class WorkTimeLogsModule {}
