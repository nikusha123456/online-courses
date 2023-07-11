import {
  Entity,
  Tree,
  Column,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Course } from '../../courses/entities/courses.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((_type) => Category, (category) => category.parent)
  @TreeChildren()
  children: Category[];

  @ManyToOne((_type) => Category, (category) => category.children)
  @TreeParent()
  parent: Category;

  @ManyToMany(() => Course, (course) => course.categories)
  courses: Course[];

  @ManyToMany(() => User, (user) => user.categories)
  users: User[];
}
