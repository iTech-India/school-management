import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TeacherAssignment } from '../../teacher-assignment/entities/teacher-assignment.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  employeeId: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  qualification: string;

  @OneToOne(() => User, (user) => user.teacher, { onDelete : 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => TeacherAssignment, (assignment) => assignment.teacher)
  assignments: TeacherAssignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

