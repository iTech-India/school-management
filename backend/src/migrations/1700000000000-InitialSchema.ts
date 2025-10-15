import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('admin', 'teacher', 'student');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar UNIQUE NOT NULL,
        "password" varchar,
        "role" "user_role_enum" NOT NULL,
        "isActive" boolean DEFAULT false,
        "passwordSet" boolean DEFAULT false,
        "resetToken" varchar,
        "resetTokenExpiry" timestamp,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create classes table
    await queryRunner.query(`
      CREATE TABLE "classes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar UNIQUE NOT NULL,
        "section" varchar,
        "description" varchar,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create subjects table
    await queryRunner.query(`
      CREATE TABLE "subjects" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar UNIQUE NOT NULL,
        "code" varchar UNIQUE NOT NULL,
        "description" varchar,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    // Create teachers table
    await queryRunner.query(`
      CREATE TABLE "teachers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "employeeId" varchar UNIQUE NOT NULL,
        "phoneNumber" varchar NOT NULL,
        "address" varchar,
        "dateOfBirth" date,
        "qualification" varchar,
        "userId" uuid UNIQUE NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "FK_teachers_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create students table
    await queryRunner.query(`
      CREATE TABLE "students" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "rollNumber" varchar UNIQUE NOT NULL,
        "phoneNumber" varchar NOT NULL,
        "parentPhoneNumber" varchar,
        "address" varchar,
        "dateOfBirth" date,
        "admissionDate" date NOT NULL,
        "userId" uuid UNIQUE NOT NULL,
        "classId" uuid,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "FK_students_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_students_classes" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL
      )
    `);

    // Create teacher_assignments table
    await queryRunner.query(`
      CREATE TABLE "teacher_assignments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "teacherId" uuid NOT NULL,
        "classId" uuid NOT NULL,
        "subjectId" uuid NOT NULL,
        "isActive" boolean DEFAULT true,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "FK_assignments_teachers" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_assignments_classes" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_assignments_subjects" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE
      )
    `);

    // Create attendances table
    await queryRunner.query(`
      CREATE TYPE "attendance_status_enum" AS ENUM('present', 'absent', 'late', 'excused');
    `);

    await queryRunner.query(`
      CREATE TABLE "attendances" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "studentId" uuid NOT NULL,
        "classId" uuid NOT NULL,
        "date" date NOT NULL,
        "status" "attendance_status_enum" DEFAULT 'present',
        "remarks" varchar,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "FK_attendances_students" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_attendances_classes" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_student_date" UNIQUE ("studentId", "date")
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users"("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_teachers_employeeId" ON "teachers"("employeeId")`);
    await queryRunner.query(`CREATE INDEX "IDX_students_rollNumber" ON "students"("rollNumber")`);
    await queryRunner.query(`CREATE INDEX "IDX_attendances_date" ON "attendances"("date")`);
    await queryRunner.query(`CREATE INDEX "IDX_attendances_student" ON "attendances"("studentId")`);

    // Insert default admin user
    await queryRunner.query(`
      INSERT INTO "users" ("email", "password", "role", "isActive", "passwordSet")
      VALUES ('admin@school.com', '$2b$10$rZ3zGEYvFVYBJYVLvIYbMeqU0XOPrVHpXFOYXqYQPVy5Y8ZGJ2YHK', 'admin', true, true)
    `);
    // Default password is 'admin123'
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "attendances"`);
    await queryRunner.query(`DROP TYPE "attendance_status_enum"`);
    await queryRunner.query(`DROP TABLE "teacher_assignments"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "teachers"`);
    await queryRunner.query(`DROP TABLE "subjects"`);
    await queryRunner.query(`DROP TABLE "classes"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}

