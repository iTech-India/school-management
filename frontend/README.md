# School Management System - Frontend

A modern, responsive school management system frontend built with React, TypeScript, and TailwindCSS.

## Features

- **Role-Based Dashboards**: Separate interfaces for Admin, Teacher, and Student
- **Authentication**: Secure login and password management
- **Admin Features**:
  - Manage teachers and students
  - Create and manage classes and subjects
  - View attendance records
  - Complete CRUD operations
- **Teacher Features**:
  - View assigned classes
  - Mark student attendance
  - Manage profile
- **Student Features**:
  - View attendance records
  - Track attendance statistics
  - Manage profile
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (default: http://localhost:3000)

## Installation

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Default Login Credentials

After setting up the backend, use these credentials:

- **Admin**:
  - Email: admin@school.com
  - Password: admin123

## Project Structure

```
frontend/
├── public/                 # Static files
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx    # Main layout with sidebar
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── context/          # React Context
│   │   └── AuthContext.tsx # Authentication context
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   │   ├── Teachers.tsx
│   │   │   ├── Students.tsx
│   │   │   ├── Classes.tsx
│   │   │   ├── Subjects.tsx
│   │   │   └── Attendance.tsx
│   │   ├── teacher/      # Teacher pages
│   │   │   ├── Profile.tsx
│   │   │   ├── MyClasses.tsx
│   │   │   └── MarkAttendance.tsx
│   │   ├── student/      # Student pages
│   │   │   ├── Profile.tsx
│   │   │   └── MyAttendance.tsx
│   │   ├── auth/         # Auth pages
│   │   │   ├── Login.tsx
│   │   │   └── SetPassword.tsx
│   │   └── Dashboard.tsx # Main dashboard
│   ├── services/         # API services
│   │   ├── api.ts       # Axios configuration
│   │   ├── authService.ts
│   │   ├── teacherService.ts
│   │   ├── studentService.ts
│   │   ├── classService.ts
│   │   ├── subjectService.ts
│   │   └── attendanceService.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables example
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md            # This file
```

## Available Pages

### Public Pages

- `/login` - Login page
- `/set-password` - Password setup page (token-based)

### Protected Pages

#### Admin Routes

- `/dashboard` - Admin dashboard with statistics
- `/teachers` - Manage teachers
- `/students` - Manage students
- `/classes` - Manage classes
- `/subjects` - Manage subjects
- `/attendance` - View attendance records

#### Teacher Routes

- `/dashboard` - Teacher dashboard
- `/my-classes` - View assigned classes
- `/mark-attendance` - Mark student attendance
- `/profile` - Teacher profile management

#### Student Routes

- `/dashboard` - Student dashboard
- `/my-attendance` - View attendance records with statistics
- `/profile` - Student profile management

## Features by Role

### Admin

1. **Teacher Management**
   - Add new teachers with complete profile
   - Edit teacher information
   - Delete teachers (deactivates user account)
   - View all teachers in a table format

2. **Student Management**
   - Add new students with complete profile
   - Assign students to classes
   - Edit student information
   - Delete students (deactivates user account)
   - View all students in a table format

3. **Class Management**
   - Create classes with name, section, and description
   - Edit class information
   - View student count per class
   - Activate/deactivate classes

4. **Subject Management**
   - Create subjects with name, code, and description
   - Edit subject information
   - Activate/deactivate subjects

5. **Attendance Monitoring**
   - View attendance by class and date
   - Filter attendance records
   - Export attendance data (future feature)

### Teacher

1. **Class Management**
   - View all assigned classes
   - See student count per class
   - Access class details

2. **Attendance Management**
   - Mark attendance for assigned classes
   - Bulk attendance marking
   - Add remarks for individual students
   - Submit daily attendance

3. **Profile Management**
   - Update personal information
   - Change phone number and address
   - Update qualification details

### Student

1. **Attendance Tracking**
   - View attendance history
   - See attendance statistics (Present, Absent, Late, Excused)
   - Filter by date range
   - View attendance percentage

2. **Profile Management**
   - Update personal information
   - Update contact details
   - View class assignment

## Styling

The application uses TailwindCSS with custom utility classes:

- `.btn` - Base button style
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-danger` - Destructive action buttons
- `.input` - Form input fields
- `.card` - Card container
- `.table` - Table styling
- `.table-header` - Table header cells
- `.table-cell` - Table data cells

## API Integration

All API calls are centralized in the `services` directory. The `api.ts` file configures Axios with:

- Base URL from environment variables
- Automatic token injection in headers
- Response interceptors for error handling
- Automatic redirect to login on 401 errors

## Development Guidelines

1. **Component Organization**
   - Keep components small and focused
   - Use TypeScript for type safety
   - Follow React hooks best practices

2. **State Management**
   - Use React Context for global state (Auth)
   - Use local state for component-specific data
   - Consider adding Redux for complex state (future)

3. **Styling**
   - Use TailwindCSS utility classes
   - Follow mobile-first responsive design
   - Maintain consistent spacing and colors

4. **Code Quality**
   - Run linter before committing
   - Write meaningful component and variable names
   - Add comments for complex logic

## Troubleshooting

### API Connection Issues

- Ensure backend is running on the correct port
- Check `VITE_API_URL` in `.env` file
- Verify CORS is enabled on backend

### Authentication Issues

- Clear browser localStorage if having login issues
- Check JWT token expiration
- Verify user credentials

### Build Issues

- Clear `node_modules` and reinstall
- Check for TypeScript errors
- Ensure all dependencies are compatible

## Future Enhancements

- [ ] Dark mode support
- [ ] Exam and grade management
- [ ] Timetable management
- [ ] Fee management
- [ ] Real-time notifications
- [ ] Parent portal
- [ ] Report generation and export
- [ ] Email notifications
- [ ] File upload for documents
- [ ] Advanced analytics

## License

MIT

