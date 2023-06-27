import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/entities/categories.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  price: number;

  @ManyToOne((_type) => User, (user) => user.courses)
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToMany(() => Category, (category) => category.courses)
  @JoinTable()
  categories: Category[];
}
