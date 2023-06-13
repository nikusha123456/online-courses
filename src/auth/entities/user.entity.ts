import { type } from 'os';
import { Course } from 'src/courses/entities/courses.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { purchasedCourse } from '../../courses/entities/purchased-courses.entity';
import { Category } from 'src/categories/entities/categories.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => Course, (course) => course.user)
  courses: Course[];

  @OneToMany(
    (_type) => purchasedCourse,
    (purchasedcourse) => purchasedcourse.user,
  )
  purchasedcourses: purchasedCourse[];

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
