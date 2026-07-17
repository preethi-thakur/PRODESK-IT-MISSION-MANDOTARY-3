import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/classService';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Toast } from '../components/ui/Toast';
import { Plus, Search } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const Classes = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    instructor: '',
    capacity: 0,
    scheduledAt: '',
  });

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: classService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsCreateModalOpen(false);
      setToast({ message: 'Class created successfully', type: 'success' });
      setFormData({ className: '', instructor: '', capacity: 0, scheduledAt: '' });
    },
    onError: () => {
      setToast({ message: 'Failed to create class', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      classService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsEditModalOpen(false);
      setToast({ message: 'Class updated successfully', type: 'success' });
      setSelectedClass(null);
    },
    onError: () => {
      setToast({ message: 'Failed to update class', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: classService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsDeleteModalOpen(false);
      setToast({ message: 'Class deleted successfully', type: 'success' });
      setSelectedClass(null);
    },
    onError: () => {
      setToast({ message: 'Failed to delete class', type: 'error' });
    },
  });

  const filteredClasses = classes?.filter(
    (classItem) =>
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e) => {
  e.preventDefault();

  createMutation.mutate({
    className: formData.className.trim(),
    instructor: formData.instructor.trim(),
    capacity: Number(formData.capacity),
    scheduledAt: new Date(formData.scheduledAt).toISOString(),
  });
};
const handleUpdate = (e) => {
  e.preventDefault();

  if (!selectedClass) return;

  updateMutation.mutate({
    id: selectedClass.id,
    data: {
      className: formData.className.trim(),
      instructor: formData.instructor.trim(),
      capacity: Number(formData.capacity),
      scheduledAt: new Date(formData.scheduledAt).toISOString(),
    },
  });
};

  
  const handleDelete = () => {
    if (selectedClass) {
      deleteMutation.mutate(selectedClass.id);
    }
  };

  const openEditModal = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      className: classItem.className,
      instructor: classItem.instructor,
      capacity: classItem.capacity,
      scheduledAt: classItem.scheduledAt,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (classItem) => {
    setSelectedClass(classItem);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const tableColumns = [
    { key: 'className', header: 'Class Name' },
    { key: 'instructor', header: 'Instructor' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'scheduledAt', header: 'Scheduled' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button className="px-3 py-1" variant="secondary" onClick={() => openEditModal(row.item)}>
            Edit
          </Button>
          <Button className="px-3 py-1" variant="danger" onClick={() => openDeleteModal(row.item)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const tableData = filteredClasses?.map((classItem) => ({
    item: classItem,
    className: classItem.className,
    instructor: classItem.instructor,
    capacity: classItem.capacity,
    scheduledAt: formatDate(classItem.scheduledAt),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-900">Classes</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-primary-500" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <Table columns={tableColumns} data={tableData} />
        </CardContent>
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Class"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Class Name"
            value={formData.className}
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
            required
          />
          <Input
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            required
          />
          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
          />
          <Input
            label="Scheduled Date"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Class"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Class Name"
            value={formData.className}
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
            required
          />
          <Input
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            required
          />
          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
          />
          <Input
            label="Scheduled Date"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending}>
              Update
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Class"
      >
        <div className="space-y-4">
          <p className="text-primary-700">
            Are you sure you want to delete "{selectedClass?.className}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
