import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dbo';
import { UpdateProjectDto } from './dto/update-project.dbo';
import { Project } from './entities/project.entity';

const mock: Project[] = [
  {
    id: 1,
    key: 'marte2030',
    description: 'descri',
    title: 'title',
    plannedHours: 250,
    owner: 'miowner',
  },
  {
    id: 2,
    key: 'marte2020',
    description: 'descri',
    title: 'title',
    plannedHours: 250,
    owner: 'miowner',
  },
  {
    id: 3,
    key: 'marte2040',
    description: 'descri',
    title: 'title',
    plannedHours: 250,
    owner: 'miowner',
  },
];

@Injectable()
export class ProjectsService {
  getManyProjects(): Project[] {
    return mock;
  }

  getOneProject(projectId: number): Project {
    throw new Error('Method not implemented.');
  }

  createOneProject(projectDto: CreateProjectDto): Project {
    const a = mock[0];
    return { ...a, ...projectDto };
  }

  partialUpdateOneProject(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
  ): Project {
    const res = mock.find((project) => (project.id = projectId));
    return { ...res, ...updateProjectDto };
  }

  deleateOneProject(projectId: number) {
    throw new Error('Method not implemented.');
  }
}
