import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneNumber?: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  technologies?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray({ each: true })
  gitRepos?: string[];
}
