import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('work-time-logs')
export class WorkTimeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  hours: number;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'project_id' })
  projectId: number;

  @ManyToOne(() => User, (user) => user.workTimeLogs, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    eager: true /*es para devolver las relación en la api*/,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Project, (project) => project.workTimeLogs, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'project_id', referencedColumnName: 'id' })
  project: Project;
}
