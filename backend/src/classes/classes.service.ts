import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) { }

  async create(createClassDto: CreateClassDto): Promise<Class> {

    const { name, section } = createClassDto;

    const existingClass = await this.classRepository.findOne({
      where: { name, section },
    });

    if (existingClass) {
      throw new BadRequestException('Class with this name and section already exists');
    }

    const classEntity = this.classRepository.create(createClassDto);
    return await this.classRepository.save(classEntity);
  }

  async findAll(): Promise<Class[]> {
    return await this.classRepository.find({
      relations: ['students', 'assignments', 'assignments.teacher', 'assignments.subject'],
    });
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['students', 'assignments', 'assignments.teacher', 'assignments.subject'],
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    return classEntity;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {

    // updated code
    const { name, section } = updateClassDto;

    const existingClass = await this.classRepository.findOne({
      where: { name, section },
    });

    if (existingClass && existingClass.id !== id) {
      throw new BadRequestException("Class with this name already exists");
    }

    const classEntity = await this.findOne(id);
    Object.assign(classEntity, updateClassDto);
    return await this.classRepository.save(classEntity);
  }

  async remove(id: string): Promise<void> {
    const classEntity = await this.findOne(id);
    await this.classRepository.update(id, { isActive: false });

    await this.classRepository.remove(classEntity);
  }
}

