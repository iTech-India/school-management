import React, { useEffect, useState } from 'react';
import { classService } from '../../services/classService';
import { Class } from '../../types';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await classService.getAll();
      setClasses(data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingClass) {
        await classService.update(editingClass.id, data);
        toast.success('Class updated successfully');
      } else {
        await classService.create(data);
        toast.success('Class created successfully');
      }
      setShowModal(false);
      reset();
      setEditingClass(null);
      fetchClasses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    reset(classItem);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await classService.delete(id);
        toast.success('Class deleted successfully');
        fetchClasses();
      } catch (error) {
        toast.error('Failed to delete class');
      }
    }
  };

  const openAddModal = () => {
    setEditingClass(null);
    reset({});
    setShowModal(true);
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
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        <button onClick={openAddModal} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {classItem.name}
                  {classItem.section && ` - ${classItem.section}`}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {classItem.students?.length || 0} students
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(classItem)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(classItem.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {classItem.description && (
              <p className="text-sm text-gray-700">{classItem.description}</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${classItem.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {classItem.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingClass ? 'Edit Class' : 'Add Class'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Class Name Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <select
                  {...register('name', { required: true })}
                  className="input"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  {[6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={`Class ${num}`}>
                      Class {num}
                    </option>
                  ))}
                </select>
                {errors.name && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>

              {/* Section Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select {...register('section')} className="input" defaultValue="">
                  <option value="" disabled>
                    Select Section
                  </option>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea {...register('description')} className="input" rows={3} />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  defaultChecked/>
                <label className="ml-2 block text-sm text-gray-900">Active</label>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;

