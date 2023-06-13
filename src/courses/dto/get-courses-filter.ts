import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';

export class GetCoursesFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Max(100000)
  maxPrice: number;
}
