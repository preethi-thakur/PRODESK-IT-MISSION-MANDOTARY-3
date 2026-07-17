import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waitlistService } from '../services/waitlistService';
import { classService } from '../services/classService';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Toast } from '../components/ui/Toast';
import { Plus, Search } from 'lucide-react';
import { formatPhoneNumber } from '../utils/formatters';

export const Waitlist = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    classId: '',
    userName: '',
    phoneNumber: '',
    status: 'pending',
  });

  const { data: waitlist, isLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: waitlistService.getAll,
  });

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: waitlistService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      setIsCreateModalOpen(false);
      setToast({ message: 'Added to waitlist successfully', type: 'success' });
      setFormData({ classId: '', userName: '', phoneNumber: '', status: 'pending' });
    },
    onError: () => {
      setToast({ message: 'Failed to add to waitlist', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      waitlistService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      setIsUpdateModalOpen(false);
      setToast({ message: 'Waitlist entry updated successfully', type: 'success' });
      setSelectedEntry(null);
    },
    onError: () => {
      setToast({ message: 'Failed to update waitlist entry', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: waitlistService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      setIsDeleteModalOpen(false);
      setToast({ message: 'Removed from waitlist successfully', type: 'success' });
      setSelectedEntry(null);
    },
    onError: () => {
      setToast({ message: 'Failed to remove from waitlist', type: 'error' });
    },
  });

  const filteredWaitlist = waitlist?.filter(
    (entry) =>
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.phoneNumber.includes(searchTerm)
  );

  const handleCreate = (e) => {
  e.preventDefault();

  createMutation.mutate({
    classId: formData.classId,
    userName: formData.userName.trim(),
    phoneNumber: formData.phoneNumber.trim(),
    status: "pending",
  });
};

  const handleUpdate = (e) => {
  e.preventDefault();

  if (!selectedEntry) return;

  updateMutation.mutate({
    id: selectedEntry.id,
    data: {
      userName: formData.userName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      status: formData.status,
    },
  });
};
  const handleDelete = () => {
    if (selectedEntry) {
      deleteMutation.mutate(selectedEntry.id);
    }
  };

  const openUpdateModal = (entry) => {
    setSelectedEntry(entry);
    setFormData({
  classId: "",
  userName: "",
  phoneNumber: "",
  status: "pending",
});
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (entry) => {
    setSelectedEntry(entry);
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
    { key: 'userName', header: 'Name' },
    { key: 'phoneNumber', header: 'Phone Number' },
    { key: 'className', header: 'Class' },
    { key: 'position', header: 'Position' },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button className="px-3 py-1" variant="secondary" onClick={() => openUpdateModal(row.item)}>
            Edit
          </Button>
          <Button className="px-3 py-1" variant="danger" onClick={() => openDeleteModal(row.item)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const tableData = filteredWaitlist?.map((entry) => ({
    item: entry,
    userName: entry.userName,
    phoneNumber: formatPhoneNumber(entry.phoneNumber),
    className: entry.class?.className || 'N/A',
    position: entry.position,
    status: entry.status,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-900">Waitlist</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Waitlist
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-primary-500" />
            <Input
              placeholder="Search waitlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
       {tableData.length === 0 ? (
  <div className="py-10 text-center text-gray-500">
    No waitlist entries found.
  </div>
) : (
  <Table columns={tableColumns} data={tableData} />
)}
        </CardContent>
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add to Waitlist"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-700">Class</label>
            <select
  value={formData.classId}
  onChange={(e) =>
    setFormData({
      ...formData,
      classId: e.target.value,
    })
  }
  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
  required
>
  <option value="">Select a class</option>

  {classes?.map((classItem) => (
    <option key={classItem.id} value={classItem.id}>
      {classItem.className}
    </option>
  ))}
</select>
          </div>
          <Input
            label="Name"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Add
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Waitlist Entry"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-700">Status</label>
            <select
  value={formData.status}
  onChange={(e) =>
    setFormData({
      ...formData,
      status: e.target.value,
    })
  }
>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Input
            label="Name"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsUpdateModalOpen(false)}>
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
        title="Remove from Waitlist"
      >
        <div className="space-y-4">
          <p className="text-primary-700">
            Are you sure you want to remove "{selectedEntry?.userName}" from the waitlist? This action cannot be undone.
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
              Remove
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
