import { Controller, Get } from '@nestjs/common';
import {
  Body,
  Delete,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common/decorators';
import { Course } from './entities/courses.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Logger } from '@nestjs/common/services';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCoursesFilterDto } from './dto/get-courses-filter';
import { filter } from 'rxjs';
import { purchasedCourse } from './entities/purchased-courses.entity';

@Controller('courses')
@UseGuards(AuthGuard())
export class CoursesController {
  private logger = new Logger('CoursesController');
  constructor(private coursesService: CoursesService) {}

  @Post('/create')
  createCourse(
    @Body() CreateCourseDto: CreateCourseDto,
    @GetUser() user: User,
  ): Promise<Course> {
    this.logger.verbose(
      `User "${user.username}" creating a new course. Data: ${JSON.stringify(
        CreateCourseDto,
      )} `,
    );
    return this.coursesService.createCourse(
      CreateCourseDto,
      user /*categories*/,
    );
  }

  @Delete('/:id')
  deleteCourse(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User "${user.username}" deleting a course.`);
    return this.coursesService.deleteCourse(id, user);
  }

  @UseGuards(AuthGuard())
  @Get()
  getCourses(
    @Body() filterDto: GetCoursesFilterDto,
    @GetUser() user: User,
  ): Promise<Course[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving courses. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.coursesService.getCourses(filterDto, user);
  }

  @Get('/allcourses')
  async getAllCourses(
    @Query('page') page: number,
  ): Promise<{ courses: Course[]; totalCount: number }> {
    return this.coursesService.getAllCourses(page);
  }

  @Patch('/:id')
  updateCourse(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const updatedCourse = this.coursesService.updateCourse(id, updateCourseDto);
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Post(':id/purchase')
  async purchaseCourse(@Param('id') id: number, @GetUser() user: User) {
    try {
      const purchasedCourse = await this.coursesService.purchaseCourse(
        id,
        user,
      );
      return {
        message: 'თქვენ წარმატებით შეიძინეთ კურსი',
        data: purchasedCourse,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('/allpurchasedcourses')
  getAllPurchasedCourses(): Promise<purchasedCourse[]> {
    return this.coursesService.getAllPurchasedCourses();
  }
}
