import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { TeacherAssignment } from '../../teacher-assignment/entities/teacher-assignment.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('classes')
//@Unique(['name', 'section'])
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  section: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @OneToMany(() => TeacherAssignment, (assignment) => assignment.class)
  assignments: TeacherAssignment[];

  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendances: Attendance[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

