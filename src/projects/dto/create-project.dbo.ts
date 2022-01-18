import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsArray,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description:
      'Key única de 8-16 carácteres alfanuméricos en minúscula de proyecto',
    example: 'martes2345',
  })
  @IsAlphanumeric()
  @IsLowercase()
  @IsNotEmpty()
  @Length(8, 16)
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Min value 1' })
  @Max(1000, { message: 'Max value 1000' })
  @IsNotEmpty()
  plannedHours: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  categoriesIds?: string[];
}
