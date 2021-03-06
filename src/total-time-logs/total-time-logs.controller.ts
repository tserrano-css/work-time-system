import {
  Controller,
  Get,
  Response,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { TotalTimeLogsService } from './total-time-logs.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/common/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('total-time-logs')
@ApiBearerAuth('JWT')
@Controller()
@UseGuards(JwtAuthGuard)
export class TotalTimeLogsController {
  constructor(private readonly totalTimeLogsService: TotalTimeLogsService) {}

  @Get('total-time-logs')
  findAll(@AuthUser() authUser: User) {
    return this.totalTimeLogsService.findAll(authUser);
  }

  @Get('total-time-logs-pdf')
  getFilePdf(@Response({ passthrough: true }) res): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'documento.pdf'));

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachement; filename="document.pdf"',
    });

    return new StreamableFile(file);
  }
}
