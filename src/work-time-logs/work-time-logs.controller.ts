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
import { WorkTimeLogsService } from './work-time-logs.service';
import { CreateWorkTimeLogDto } from './dto/create-work-time-log.dto';
import { UpdateWorkTimeLogDto } from './dto/update-work-time-log.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/common/auth-user.decorator';

@ApiTags('work-time-logs')
@Controller('work-time-logs')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class WorkTimeLogsController {
  constructor(private readonly workTimeLogsService: WorkTimeLogsService) {}

  @Get()
  findAll(@AuthUser() authUser: User) {
    return this.workTimeLogsService.findAll(authUser);
  }

  @Get(':id')
  findOne(@AuthUser() authUser: User, @Param('id') id: string) {
    return this.workTimeLogsService.findOne(id, authUser);
  }

  @Post()
  create(@Body() createWorkTimeLogDto: CreateWorkTimeLogDto) {
    /*
    const user: User = {
      id: 2,
      username: 'miusername',
      email: 'miusername@gmail.com',
      password: 'pass',
      name: 'Alberto',
      lastName: 'Morales',
    };

    return this.workTimeLogsService.create(createWorkTimeLogDto, user);
    */
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkTimeLogDto: UpdateWorkTimeLogDto,
  ) {
    return this.workTimeLogsService.update(+id, updateWorkTimeLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workTimeLogsService.remove(+id);
  }
}
