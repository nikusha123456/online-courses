import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class purchasedCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  purchaseDate: Date;

  @ManyToOne((_type) => User, (user) => user.purchasedcourses)
  @Exclude({ toPlainOnly: true })
  user: User;
}
