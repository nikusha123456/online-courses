import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Category } from 'src/categories/entities/categories.entity';

export class CreateCourseDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  price: number;

  // @IsArray()
  // @ArrayNotEmpty()
  // @ArrayMinSize(1)
  // categories: string;
}
