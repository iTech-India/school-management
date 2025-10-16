import React, { useEffect, useState } from 'react';
import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [employeeIdLoading, setEmployeeIdLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      setTeachers(data);
    } catch (error) {
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedEmployeeId = async () => {
    try {
      setEmployeeIdLoading(true);
      const nextNumber = await teacherService.getSuggestedEmployeeId();
      reset({ employeeId: nextNumber });
    } catch (error) {
      toast.error('Failed to fetch Employee ID');
    } finally {
      setEmployeeIdLoading(false);
    }
  };

  const openAddModal = async () => {
    setEditingTeacher(null);
    reset({});
    setShowModal(true);
    await fetchSuggestedEmployeeId();
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    reset(teacher);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await teacherService.delete(id);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to delete teacher');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingTeacher) {
        await teacherService.update(editingTeacher.id, data);
        toast.success('Teacher updated successfully');
      } else {
        await teacherService.create(data);
        toast.success('Teacher created successfully');
      }
      setShowModal(false);
      reset();
      setEditingTeacher(null);
      fetchTeachers();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
        <button onClick={openAddModal} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Teacher
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Employee ID</th>
                <th className="table-header">Email</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Qualification</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="table-cell">{teacher.firstName} {teacher.lastName}</td>
                  <td className="table-cell">{teacher.employeeId}</td>
                  <td className="table-cell">{teacher.user?.email || 'N/A'}</td>
                  <td className="table-cell">{teacher.phoneNumber}</td>
                  <td className="table-cell">{teacher.qualification || 'N/A'}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(teacher)} className="text-primary-600 hover:text-primary-900"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' },
                      pattern: { value: /^[A-Za-z\s]+$/, message: 'Only letters allowed' },
                    })}
                    className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <span className="text-red-500 text-sm">{String(errors.firstName.message)}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' },
                      pattern: { value: /^[A-Za-z\s]+$/, message: 'Only letters allowed' },
                    })}
                    className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <span className="text-red-500 text-sm">{String(errors.lastName.message)}</span>}
                </div>
              </div>

              {/* Email */}
              {!editingTeacher && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                    })}
                    className={`input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="teacher@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-sm">{String(errors.email.message)}</span>}
                </div>
              )}

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
                <input
                  {...register('employeeId', { required: !editingTeacher ? 'Employee ID is required' : false })}
                  className={`input ${errors.employeeId ? 'border-red-500' : ''}`}
                  placeholder={employeeIdLoading ? 'Loading...' : 'EMP001'}
                  disabled
                  style={{ color: '#6B7280', backgroundColor: '#E5E7EB' }}
                />
                {errors.employeeId && <span className="text-red-500 text-sm">{String(errors.employeeId.message)}</span>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit phone number' },
                  })}
                  className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  placeholder="9876543210"
                  maxLength={10}
                />
                {errors.phoneNumber && <span className="text-red-500 text-sm">{String(errors.phoneNumber.message)}</span>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea {...register('address')} className="input" rows={3} />
              </div>

              {/* DOB & Qualification */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    {...register('dateOfBirth', {
                      validate: (value) => {
                        if (!value) return true; // optional field
                        const dob = new Date(value);
                        const today = new Date();
                        const minAge = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                        if (dob > today) return 'DOB cannot be in the future';
                        if (dob > minAge) return 'Teacher must be at least 18 years old';
                        return true;
                      },
                    })}
                    max={new Date().toISOString().split('T')[0]}
                    className={`input ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  />
                  {errors.dateOfBirth && <span className="text-red-500 text-sm">{String(errors.dateOfBirth.message)}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                  <select
                    {...register('qualification', { required: 'Qualification is required' })}
                    className={`input ${errors.qualification ? 'border-red-500' : ''}`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Qualification
                    </option>
                    <option value="B.Sc CS">B.Sc CS</option>
                    <option value="B.Com">B.Com</option>
                    <option value="B.A English">B.A English</option>
                    <option value="B.A Tamil">B.A Tamil</option>
                    <option value="B.Ed">B.Ed</option>
                    <option value="M.Ed">M.Ed</option>
                    <option value="M.Com">M.Com</option>
                  </select>
                  {errors.qualification && (
                    <span className="text-red-500 text-sm">{String(errors.qualification.message)}</span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingTeacher ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
