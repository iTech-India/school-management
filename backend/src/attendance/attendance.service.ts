import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Student } from '../student/entities/student.entity';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Check if attendance already exists for this student on this date
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        studentId: createAttendanceDto.studentId,
        date: new Date(createAttendanceDto.date),
      },
    });

    if (existingAttendance) {
      throw new BadRequestException('Attendance already marked for this student on this date');
    }

    const attendance = this.attendanceRepository.create(createAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  async createBulk(bulkAttendanceDto: BulkAttendanceDto): Promise<Attendance[]> {
    const attendances = [];

    for (const attendanceDto of bulkAttendanceDto.attendances) {
      // Check if attendance already exists
      const existingAttendance = await this.attendanceRepository.findOne({
        where: {
          studentId: attendanceDto.studentId,
          date: new Date(bulkAttendanceDto.date),
        },
      });

      if (existingAttendance) {
        // Update existing attendance
        Object.assign(existingAttendance, {
          status: attendanceDto.status,
          remarks: attendanceDto.remarks,
        });
        attendances.push(await this.attendanceRepository.save(existingAttendance));
      } else {
        // Create new attendance
        const attendance = this.attendanceRepository.create({
          ...attendanceDto,
          date: bulkAttendanceDto.date,
          classId: bulkAttendanceDto.classId,
        });
        attendances.push(await this.attendanceRepository.save(attendance));
      }
    }

    return attendances;
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      relations: ['student', 'student.user', 'class'],
      order: { date: 'DESC' },
    });
  }

  async findByStudent(studentId: string, startDate?: string, endDate?: string): Promise<Attendance[]> {
    const where: any = { studentId };

    if (startDate && endDate) {
      where.date = Between(new Date(startDate), new Date(endDate));
    }

    return await this.attendanceRepository.find({
      where,
      relations: ['class'],
      order: { date: 'DESC' },
    });
  }

  async findByUserId(userId: string, startDate?: string, endDate?: string): Promise<Attendance[]> {
    // First, find the student by userId
    const student = await this.studentRepository.findOne({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Then get attendance records for that student
    return this.findByStudent(student.id, startDate, endDate);
  }

  async findByClass(classId: string, date?: string): Promise<Attendance[]> {
    const where: any = { classId };

    if (date) {
      where.date = new Date(date);
    }

    return await this.attendanceRepository.find({
      where,
      relations: ['student', 'student.user'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['student', 'student.user', 'class'],
    });
    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    Object.assign(attendance, updateAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  async remove(id: string): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.remove(attendance);
  }
}

