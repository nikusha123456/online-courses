import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/courses.entity';
import { DeepPartial, Entity, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Logger } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCoursesFilterDto } from './dto/get-courses-filter';
import { CreatePurchasedCourseDto } from './dto/purchased-courses.dto';
import { purchasedCourse } from './entities/purchased-courses.entity';
import { Category } from 'src/categories/entities/categories.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(purchasedCourse)
    private readonly purchasedcoursesRepository: Repository<purchasedCourse>,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    user: User,
    /*categories: Category[]*/
  ): Promise<Course> {
    const { title, description, imageUrl, price } = createCourseDto;

    const course = this.coursesRepository.create({
      title,
      description,
      imageUrl,
      price,
      user: user,
      // categories,
    });
    await this.coursesRepository.save(course);
    return course;
  }

  async deleteCourse(id: number, user: User): Promise<void> {
    const course = await this.coursesRepository.findOne({ where: { id: id } });
    await this.coursesRepository.remove(course);
  }

  async getCourses(
    filterDto: GetCoursesFilterDto,
    user: User,
  ): Promise<Course[]> {
    const { title, minPrice, maxPrice } = filterDto;
    const course = Course;
    const query = this.coursesRepository.createQueryBuilder('course');

    query.where('course.user = :userId', { userId: user.id });
    if (title) {
      query.andWhere('course.title LIKE :title', {
        title: `%${filterDto.title}%`,
      });
    }
    if (minPrice) {
      query.andWhere('course.price >= :minPrice', {
        minPrice: filterDto.minPrice,
      });
    }
    if (maxPrice) {
      query.andWhere('course.price <= :maxPrice', {
        maxPrice: filterDto.maxPrice,
      });
    }
    const courses = await query.getMany();
    return courses;
  }

  async getAllCourses(
    page = 1,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    try {
      const [courses, totalCount] = await this.coursesRepository.findAndCount({
        take: 9,
        skip: 9 * (page - 1),
        select: ['id', 'title', 'description', 'price'],
        order: { id: 'DESC' },
      });
      return { courses, totalCount };
    } catch (error) {
      throw new NotFoundException('Courses not found');
    }
  }

  async updateCourse(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException('კურსი ვერ მოიძებნა');
    }

    course.title = updateCourseDto.title || course.title;
    course.description = updateCourseDto.description || course.description;
    course.imageUrl = updateCourseDto.imageUrl || course.imageUrl;
    course.price = updateCourseDto.price || course.price;

    await this.coursesRepository.save(course);

    return course;
  }

  async getCourseById(id: number, user: User): Promise<Course> {
    const found = await this.coursesRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`კურსი მოცემული აიდით "${id}" ვერ მოიძებნა`);
    }

    return found;
  }

  async purchaseCourse(id: number, user: User): Promise<purchasedCourse> {
    const course = await this.coursesRepository.findOne({ where: { id } });

    if (!course) {
      throw new NotFoundException('კურსი ვერ მოიძებნა');
    }

    const purchasedCourse: DeepPartial<purchasedCourse> = {
      id: course.id,
      title: course.title,
      purchaseDate: new Date(),
      user: user,
    };
    await this.purchasedcoursesRepository.create([purchasedCourse]);
    return this.purchasedcoursesRepository.save(purchasedCourse);
  }

  async getAllPurchasedCourses(): Promise<purchasedCourse[]> {
    return this.purchasedcoursesRepository.find();
  }
}
