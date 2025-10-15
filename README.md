# School Management System

A comprehensive, full-stack school management system built with modern technologies. This application provides role-based access control for Admins, Teachers, and Students, featuring attendance management, user management, and class organization.

## 🚀 Features

### Admin Features
- **Teacher Management**: Add, edit, and remove teachers with complete profile management
- **Student Management**: Manage student records, assign to classes, track admissions
- **Class Management**: Create and organize classes with sections
- **Subject Management**: Define and manage subjects taught in the school
- **Attendance Overview**: View and monitor attendance records across all classes
- **Dashboard**: Real-time statistics and quick actions

### Teacher Features
- **Class Assignment**: View all assigned classes and subjects
- **Attendance Marking**: Mark daily attendance for students with bulk operations
- **Profile Management**: Update personal information and credentials
- **Student Overview**: View students in assigned classes

### Student Features
- **Attendance Tracking**: View personal attendance history and statistics
- **Attendance Analytics**: Calculate attendance percentage and trends
- **Profile Management**: Update personal information and contact details
- **Class Information**: View assigned class and schedule

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator
- **Password Security**: bcrypt

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Toastify
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd school-management
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb school_management

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Build the project
npm run build

# Run database migrations
npm run migration:run

# Start the backend server
npm run start:dev
```

The backend API will be available at `http://localhost:3000/api`

**Default Admin Credentials** (created by migration):
- Email: `admin@school.com`
- Password: `admin123`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your backend API URL

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 📁 Project Structure

```
school-management/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── attendance/        # Attendance module
│   │   ├── auth/              # Authentication & authorization
│   │   ├── classes/           # Class management
│   │   ├── config/            # Configuration files
│   │   ├── migrations/        # Database migrations
│   │   ├── student/           # Student module
│   │   ├── subjects/          # Subject module
│   │   ├── teacher/           # Teacher module
│   │   ├── teacher-assignment/# Teacher-Class-Subject assignments
│   │   ├── users/             # User management
│   │   ├── app.module.ts      # Main application module
│   │   └── main.ts            # Application entry point
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── README.md              # Backend documentation
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Auth)
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── teacher/       # Teacher pages
│   │   │   ├── student/       # Student pages
│   │   │   └── auth/          # Authentication pages
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript type definitions
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Application entry point
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── README.md              # Frontend documentation
│
└── README.md                   # This file
```

## 🔐 Security Features

- **Password Hashing**: All passwords are securely hashed using bcrypt
- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Role-Based Access Control (RBAC)**: Three distinct roles with specific permissions
- **Protected Routes**: Frontend and backend route protection
- **Token Expiration**: Automatic token expiration and renewal
- **Password Reset**: Secure password setup with token-based verification

## 🎯 User Roles & Permissions

### Admin
- Full access to all features
- Manage teachers, students, classes, and subjects
- View all attendance records
- System configuration

### Teacher
- View assigned classes and subjects
- Mark student attendance
- View student information
- Update own profile

### Student
- View personal attendance records
- View attendance statistics
- Update own profile
- View class information

## 🗄️ Database Schema

### Main Entities
- **Users**: Authentication and role management
- **Teachers**: Teacher profiles and credentials
- **Students**: Student profiles and class assignments
- **Classes**: Class information and organization
- **Subjects**: Subject definitions
- **Teacher Assignments**: Teacher-Class-Subject mappings
- **Attendances**: Daily attendance records

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/set-password` - Set/reset password

### Teacher Endpoints
- `GET /api/teachers` - List all teachers
- `POST /api/teachers` - Create teacher
- `GET /api/teachers/:id` - Get teacher details
- `PATCH /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Student Endpoints
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student details
- `PATCH /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance Endpoints
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `POST /api/attendance/bulk` - Bulk create attendance
- `GET /api/attendance/my-attendance` - Get student's attendance

For complete API documentation, see [Backend README](./backend/README.md)

## 🚀 Deployment

### Backend Deployment

1. Build the application:
```bash
cd backend
npm run build
```

2. Set production environment variables

3. Run migrations:
```bash
npm run migration:run
```

4. Start the server:
```bash
npm run start:prod
```

### Frontend Deployment

1. Build the application:
```bash
cd frontend
npm run build
```

2. Serve the `dist` folder using any static file server (Nginx, Apache, etc.)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=school_management
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, please open an issue in the GitHub repository.

## 🔄 Future Enhancements

- [ ] Email notifications for attendance and announcements
- [ ] SMS notifications for parents
- [ ] Exam and grade management
- [ ] Timetable management
- [ ] Fee management and payment integration
- [ ] Library management
- [ ] Transport management
- [ ] Parent portal
- [ ] Mobile application (React Native)
- [ ] Report generation and PDF export
- [ ] Advanced analytics and insights
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Real-time notifications using WebSockets

## 📸 Screenshots

(Add screenshots of your application here)

## 🙏 Acknowledgments

- NestJS Documentation
- React Documentation
- TailwindCSS Documentation
- TypeORM Documentation
- PostgreSQL Documentation

