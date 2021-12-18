import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dbo';
import { UpdateProjectDto } from './dto/update-project.dbo';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getManyProjects(): Project[] {
    return this.projectsService.getManyProjects();
  }

  @Get(':projectId')
  @HttpCode(HttpStatus.OK)
  getOneProject(@Param('projectId', ParseIntPipe) projectId: number): Project {
    return this.projectsService.getOneProject(projectId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOneProject(@Body() projectDto: CreateProjectDto): Project {
    return this.projectsService.createOneProject(projectDto);
  }

  @Patch(':projectId')
  @HttpCode(HttpStatus.OK)
  partialUpdateOneProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Project {
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
