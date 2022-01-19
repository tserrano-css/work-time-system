import { Controller, Get, UseGuards } from '@nestjs/common';
import { TotalTimeLogsService } from './total-time-logs.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/common/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiTags('total-time-logs')
@ApiBearerAuth('JWT')
@Controller('total-time-logs')
@UseGuards(JwtAuthGuard)
export class TotalTimeLogsController {
  constructor(private readonly totalTimeLogsService: TotalTimeLogsService) {}

  @Get()
  findAll(@AuthUser() authUser: User) {
    return this.totalTimeLogsService.findAll(authUser);
  }
}
