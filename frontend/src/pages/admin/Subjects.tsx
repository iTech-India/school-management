import React, { useEffect, useState } from 'react';
import { subjectService } from '../../services/subjectService';
import { Subject } from '../../types';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingSubject) {
        await subjectService.update(editingSubject.id, data);
        toast.success('Subject updated successfully');
      } else {
        await subjectService.create(data);
        toast.success('Subject created successfully');
      }
      setShowModal(false);
      reset();
      setEditingSubject(null);
      fetchSubjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    reset(subject);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectService.delete(id);
        toast.success('Subject deleted successfully');
        fetchSubjects();
      } catch (error) {
        toast.error('Failed to delete subject');
      }
    }
  };

  const openAddModal = () => {
    setEditingSubject(null);
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
      {/* Top header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
        <button onClick={openAddModal} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Subject
        </button>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Code: {subject.code}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(subject)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            {subject.description && (
              <p className="text-sm text-gray-700">{subject.description}</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${subject.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {subject.isActive ? 'Active' : 'Inactive'}
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
                {editingSubject ? 'Edit Subject' : 'Add Subject'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Subject Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name *
                </label>
                <input
                  {...register('name', { required: true })}
                  className="input"
                  placeholder="Mathematics"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>

              {/* Subject Code with Generate button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Code *
                </label>
                <div className="flex gap-2">
                  <input
                    {...register('code', { required: true })}
                    className="input flex-1"
                    placeholder="MATH123"
                    
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const subjectName = getValues('name');
                      if (!subjectName || subjectName.trim().length < 3) {
                        toast.warning('Enter a valid subject name first');
                        return;
                      }
                      try {
                        const generatedCode = await subjectService.generateCode(subjectName);
                        setValue('code', generatedCode);
                        toast.success('Subject code generated!');
                      } catch {
                        toast.error('Failed to generate subject code');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md border border-gray-300 transition-all">
                    <Plus size={16} /> Generate
                  </button>
                </div>
                {errors.code && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea {...register('description')} className="input" rows={3} />
              </div>

              {/* Active checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label className="ml-2 block text-sm text-gray-900">Active</label>
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
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
