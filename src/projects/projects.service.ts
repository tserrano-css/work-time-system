import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
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
    private readonly categoriesService: CategoriesService,
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

    let categories: Category[] = [];
    if (projectDto.categoriesIds && projectDto.categoriesIds.length > 0) {
      categories = await this.categoriesService.findByIds(
        projectDto.categoriesIds,
      );
    }

    const tempEntity = await this.projectRepository.create(projectDto);
    tempEntity.userId = authUser.id;

    if (categories.length > 0) {
      tempEntity.categories = categories;
    }

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

    let categories: Category[] = [];
    if (updateProjectDto.categoriesIds) {
      categories = await this.categoriesService.findByIds(
        updateProjectDto.categoriesIds,
      );
    }

    preloadProject.categories = categories;

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
