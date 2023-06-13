import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/courses.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { AuthModule } from 'src/auth/auth.module';
import { purchasedCourse } from './entities/purchased-courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, purchasedCourse]), AuthModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
