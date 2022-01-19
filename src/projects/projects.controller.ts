import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/common/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserProjectAffiliation } from './decorators/user-project-affiliation.decorator';
import { CreateProjectDto } from './dto/create-project.dbo';
import { UpdateProjectDto } from './dto/update-project.dbo';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { UserProjectAffiliationType } from './types/user-project-affiliation';

@ApiTags('projects')
@ApiBearerAuth('JWT')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getManyProjects(
    @AuthUser() authUser: User,
    @UserProjectAffiliation() affiliation: UserProjectAffiliationType,
  ): Promise<Project[]> {
    return this.projectsService.getManyProjects(affiliation, authUser);
  }

  @Get(':projectId')
  @HttpCode(HttpStatus.OK)
  async getOneProject(
    @AuthUser() authUser: User,
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
  createOneProject(
    @AuthUser() authUser: User,
    @Body() projectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectsService.createOneProject(projectDto, authUser);
  }

  @Patch(':projectId')
  @HttpCode(HttpStatus.OK)
  partialUpdateOneProject(
    @AuthUser() authUser: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.partialUpdateOneProject(
      projectId,
      updateProjectDto,
      authUser,
    );
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleateOneProject(
    @AuthUser() authUser: User,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.projectsService.deleateOneProject(projectId, authUser);
  }
}
