import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  phoneNumber?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  technologies?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  gitRepos?: string[];
}
