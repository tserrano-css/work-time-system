import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'user_cursonest',
      password: 'password_cursonest',
      database: 'db_cursonest',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
