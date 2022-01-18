import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkTimeLog } from 'src/work-time-logs/entities/work-time-log.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description:
      'Código alphanumérico 8-16 dígitos en letres minúsculas unico para cada proyecto',
  })
  @Column({
    type: 'character varying',
    unique: true,
    comment: 'Key unica del proyecto',
    length: 16,
  })
  key: string;

  @ApiProperty({ description: 'Titulo' })
  @Column({
    type: 'character varying',
    comment: 'Titulo del proyecto',
    length: 80,
  })
  title: string;

  @ApiProperty({ description: 'Descripcion' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Horas planificadas', type: 'integer' })
  @Column({ name: 'planned_hours', type: 'integer' })
  plannedHours: number;

  @Exclude()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
    eager: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => WorkTimeLog, (workTimeLog) => workTimeLog.project)
  workTimeLogs: WorkTimeLog[];

  @JoinTable({
    name: 'project_categori',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoriId', referencedColumnName: 'id' },
  })
  @ManyToMany(() => Category, { eager: true })
  categories?: Category[];
}
