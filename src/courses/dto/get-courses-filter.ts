import { IsOptional, IsString } from 'class-validator';

export class GetCoursesFilterDto {
  @IsOptional()
  @IsString()
  title?: string;
}
