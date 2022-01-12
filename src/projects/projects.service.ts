import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dbo';
import { UpdateProjectDto } from './dto/update-project.dbo';
import { Project } from './entities/project.entity';
import {
  Affiliation,
  UserProjectAffiliationType,
} from './types/user-project-affiliation';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  getManyProjects(
    affiliation: UserProjectAffiliationType,
    authUser: User,
  ): Promise<Project[]> {
    if (affiliation === Affiliation.OWNER) {
      return this.projectRepository.find({
        where: {
          userId: authUser.id,
        },
      });
    }

    return this.projectRepository.find();
  }

  getOneProject(projectId: number): Promise<Project> {
    return this.projectRepository.findOne(projectId);
  }

  async createOneProject(
    projectDto: CreateProjectDto,
    authUser: User,
  ): Promise<Project> {
    const countExist = await this.projectRepository.count({
      where: {
        key: projectDto.key,
      },
    });

    if (countExist > 0) {
      throw new ConflictException(`La key ${projectDto.key} ya existe`);
    }

    const tempEntity = await this.projectRepository.create(projectDto);
    tempEntity.userId = authUser.id;
    const objSaved = await this.projectRepository.save(tempEntity);

    return this.projectRepository.findOne(objSaved.id);
  }

  async partialUpdateOneProject(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
    authUser: User,
  ): Promise<Project> {
    const preloadData = {
      id: projectId,
      ...updateProjectDto,
    };
    const preloadProject = await this.projectRepository.preload(preloadData);

    if (!preloadProject) {
      throw new NotFoundException('El proyecto no existe');
    }

    if (!(preloadProject.userId === authUser.id)) {
      throw new UnauthorizedException('No es dueño del proyecto');
    }

    return this.projectRepository.save(preloadProject);
  }

  async deleateOneProject(projectId: number, authUser: User): Promise<void> {
    const project = await this.projectRepository.findOne(projectId);

    if (!project || project.userId !== authUser.id) {
      return;
    }

    this.projectRepository.delete(project);
  }
}
