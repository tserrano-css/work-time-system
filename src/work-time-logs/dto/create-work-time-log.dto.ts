import { IsDateString, IsNumber, Max, Min } from 'class-validator';

export class CreateWorkTimeLogDto {
  @IsNumber()
  @Min(1)
  @Max(12)
  hours: number;

  @IsDateString()
  date: string;

  @IsNumber()
  projectId: number;
}
