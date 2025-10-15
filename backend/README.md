# School Management System - Backend

A comprehensive school management system backend built with NestJS, TypeORM, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Teacher, Student)
- **User Management**: Complete CRUD operations for users
- **Teacher Management**: Manage teacher profiles, assignments, and classes
- **Student Management**: Manage student profiles, classes, and attendance
- **Class & Subject Management**: Create and manage classes and subjects
- **Attendance System**: Mark and track student attendance
- **Database Migrations**: TypeORM migrations for database schema management

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup PostgreSQL Database**

Create a PostgreSQL database:

```sql
CREATE DATABASE school_management;
```

4. **Configure Environment Variables**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=school_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

5. **Run Database Migrations**

```bash
npm run build
npm run migration:run
```

This will create all necessary tables and insert a default admin user:
- Email: `admin@school.com`
- Password: `admin123`

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`

### Production Mode

```bash
npm run build
npm run start:prod
```

## Database Migrations

### Generate a new migration

```bash
npm run migration:generate -- src/migrations/MigrationName
```

### Create a blank migration

```bash
npm run migration:create -- src/migrations/MigrationName
```

### Run migrations

```bash
npm run migration:run
```

### Revert last migration

```bash
npm run migration:revert
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/set-password` - Set password using reset token

### Teachers (Admin only)

- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create a new teacher
- `GET /api/teachers/:id` - Get teacher by ID
- `PATCH /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher
- `GET /api/teachers/profile` - Get current teacher profile (Teacher role)

### Students (Admin only for CRUD, Teachers can view)

- `GET /api/students` - Get all students (with optional classId filter)
- `POST /api/students` - Create a new student
- `GET /api/students/:id` - Get student by ID
- `PATCH /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/profile` - Get current student profile (Student role)

### Classes (Admin only)

- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create a new class
- `GET /api/classes/:id` - Get class by ID
- `PATCH /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Subjects (Admin only)

- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a new subject
- `GET /api/subjects/:id` - Get subject by ID
- `PATCH /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Attendance (Admin & Teachers can manage, Students can view own)

- `GET /api/attendance` - Get attendance records (with filters)
- `POST /api/attendance` - Create single attendance record
- `POST /api/attendance/bulk` - Create bulk attendance records
- `GET /api/attendance/my-attendance` - Get current student's attendance
- `PATCH /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

## Default Users

After running migrations, a default admin user is created:

- **Email**: admin@school.com
- **Password**: admin123

**Important**: Change this password after first login in production!

## Project Structure

```
backend/
├── src/
│   ├── attendance/          # Attendance module
│   ├── auth/               # Authentication module
│   ├── classes/            # Classes module
│   ├── config/             # Configuration files
│   ├── migrations/         # Database migrations
│   ├── student/            # Student module
│   ├── subjects/           # Subjects module
│   ├── teacher/            # Teacher module
│   ├── teacher-assignment/ # Teacher assignment module
│   ├── users/              # Users module
│   ├── app.module.ts       # Main application module
│   └── main.ts             # Application entry point
├── .env.example            # Environment variables example
├── nest-cli.json           # NestJS CLI configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md              # This file
```

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control (RBAC) is implemented
- All API endpoints (except login and set-password) require authentication

## Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify the database exists

### Migration Errors

- Ensure the database is accessible
- Run `npm run build` before running migrations
- Check migration files for syntax errors

## License

MIT

