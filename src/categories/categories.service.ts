import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name, parent_id } = createCategoryDto;

    const category = this.categoryRepository.create({
      name,
      id: parent_id,
    });
    await this.categoryRepository.save(category);
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    await this.categoryRepository.remove(category);
  }

  async getAllCategories() {
    return this.categoryRepository.find({ relations: ['parent', 'children'] });
  }
}
