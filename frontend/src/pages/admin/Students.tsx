import React, { useEffect, useState } from 'react';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { Student, Class } from '../../types';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange', // validates while typing
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, classesData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
      ]);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRollNumberId = async () => {
    try {
      const nextNumber = await studentService.getSuggestedRollNumberId(); // e.g., STU001
      reset({ rollNumber: nextNumber });
    } catch {
      toast.error('Failed to fetch Roll Number ID');
    }
  };

  const openAddModal = async () => {
    setEditingStudent(null);
    reset({
      admissionDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
    await fetchRollNumberId();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    reset(student);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        toast.success('Student deleted successfully');
        fetchData();
      } catch {
        toast.error('Failed to delete student');
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, data);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(data);
        toast.success('Student created successfully');
      }
      setShowModal(false);
      reset();
      setEditingStudent(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <button onClick={openAddModal} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Roll Number</th>
                <th className="table-header">Email</th>
                <th className="table-header">Class</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Parent Phone</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="table-cell">{student.rollNumber}</td>
                  <td className="table-cell">{student.user?.email || 'N/A'}</td>
                  <td className="table-cell">{student.class?.name || 'Not Assigned'}</td>
                  <td className="table-cell">{student.phoneNumber}</td>
                  <td className="table-cell">{student.parentPhoneNumber || 'N/A'}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingStudent ? 'Edit Student' : 'Add Student'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First / Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters required' },
                      pattern: { value: /^[A-Za-z\s]+$/, message: 'Only alphabets allowed' },
                    })}
                    className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">{String(errors.firstName.message)}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters required' },
                    })}
                    className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">{String(errors.lastName.message)}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              {!editingStudent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="student@example.com"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{String(errors.email.message)}</span>
                  )}
                </div>
              )}

              {/* Roll Number / Class */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number *
                  </label>
                  <input
                    {...register('rollNumber', { required: 'Roll number is required' })}
                    className="input bg-gray-100 text-gray-600"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <select
                    {...register('classId', { required: 'Class is required' })}
                    className={`input ${errors.classId ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} {cls.section}
                      </option>
                    ))}
                  </select>
                  {errors.classId && (
                    <span className="text-red-500 text-sm">{String(errors.classId.message)}</span>
                  )}
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit phone number',
                      },
                    })}
                    className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  {errors.phoneNumber && (
                    <span className="text-red-500 text-sm">{String(errors.phoneNumber.message)}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Phone
                  </label>
                  <input
                    {...register('parentPhoneNumber', {
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit phone number',
                      },
                    })}
                    className={`input ${errors.parentPhoneNumber ? 'border-red-500' : ''}`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  {errors.parentPhoneNumber && (
                    <span className="text-red-500 text-sm">
                      {String(errors.parentPhoneNumber.message)}
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea {...register('address')} className="input" rows={3} />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth', {
                      required: 'Date of birth is required',
                      validate: (value) => {
                        const dob = new Date(value);
                        const today = new Date();
                        const minAge = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
                        if (dob > today) return 'DOB cannot be in the future';
                        if (dob > minAge) return 'Student must be at least 3 years old';
                        return true;
                      },
                    })}
                    max={new Date().toISOString().split('T')[0]}
                    className={`input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  />
                  {errors.dateOfBirth && (
                    <span className="text-red-500 text-sm">{String(errors.dateOfBirth.message)}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admission Date *
                  </label>
                  <input
                    type="date"
                    {...register('admissionDate', {
                      required: 'Admission date is required',
                      validate: (value) => {
                        const today = new Date();
                        const date = new Date(value);
                        if (date > today) return 'Admission date cannot be in the future';
                        return true;
                      },
                    })}
                    max={new Date().toISOString().split('T')[0]}
                    className={`input ${errors.admissionDate ? 'border-red-500' : ''}`}
                  />
                  {errors.admissionDate && (
                    <span className="text-red-500 text-sm">{String(errors.admissionDate.message)}</span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
