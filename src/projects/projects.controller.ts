import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dbo';
import { UpdateProjectDto } from './dto/update-project.dbo';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getManyProjects(): Promise<Project[]> {
    return this.projectsService.getManyProjects();
  }

  @Get(':projectId')
  @HttpCode(HttpStatus.OK)
  async getOneProject(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Project> {
    const project = await this.projectsService.getOneProject(projectId);

    if (!project) {
      throw new NotFoundException(`Proyecto con id ${projectId} no existe`);
    }
    return project;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOneProject(@Body() projectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createOneProject(projectDto);
  }

  @Patch(':projectId')
  @HttpCode(HttpStatus.OK)
  partialUpdateOneProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.partialUpdateOneProject(
      projectId,
      updateProjectDto,
    );
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleateOneProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.deleateOneProject(projectId);
  }
}
