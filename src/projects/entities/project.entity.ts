import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  key: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ name: 'planned_hours', type: 'integer' })
  plannedHours: number;

  owner: any;
}
