import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Class } from '../../classes/entities/class.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity('teacher_assignments')
export class TeacherAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignments)
  teacher: Teacher;

  @Column()
  teacherId: string;

  @ManyToOne(() => Class, (classEntity) => classEntity.assignments)
  class: Class;

  @Column()
  classId: string;

  @ManyToOne(() => Subject, (subject) => subject.assignments)
  subject: Subject;

  @Column()
  subjectId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

