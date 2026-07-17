import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Toast } from '../components/ui/Toast';
import { Send, Search } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const Notifications = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    waitlistId: '',
    message: '',
  });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAll,
  });

  const sendMutation = useMutation({
    mutationFn: notificationService.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setIsSendModalOpen(false);
      setToast({ message: 'Notification sent successfully', type: 'success' });
      setFormData({ waitlistId: '', message: '' });
    },
    onError: () => {
      setToast({ message: 'Failed to send notification', type: 'error' });
    },
  });

  const filteredNotifications = notifications?.filter(
    (notification) =>
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.waitlist?.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();
    sendMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const tableColumns = [
    { key: 'userName', header: 'Recipient' },
    { key: 'phoneNumber', header: 'Phone Number' },
    { key: 'message', header: 'Message' },
    { key: 'provider', header: 'Provider' },
    { key: 'deliveryStatus', header: 'Status' },
    { key: 'sentAt', header: 'Sent At' },
  ];

  const tableData = filteredNotifications?.map((notification) => ({
    userName: notification.waitlist?.userName || 'N/A',
    phoneNumber: notification.waitlist?.phoneNumber || 'N/A',
    message: notification.message.substring(0, 50) + (notification.message.length > 50 ? '...' : ''),
    provider: notification.provider,
    deliveryStatus: notification.deliveryStatus,
    sentAt: formatDate(notification.sentAt),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-900">Notifications</h1>
        <Button onClick={() => setIsSendModalOpen(true)}>
          <Send className="w-4 h-4 mr-2" />
          Send Notification
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-primary-500" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <Table columns={tableColumns} data={tableData} />
        </CardContent>
      </Card>

      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send SMS Notification"
      >
        <form onSubmit={handleSend} className="space-y-4">
          <Input
            label="Waitlist Entry ID"
            value={formData.waitlistId}
            onChange={(e) => setFormData({ ...formData, waitlistId: e.target.value })}
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-700">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
              placeholder="Enter your message..."
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsSendModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={sendMutation.isPending}>
              Send
            </Button>
          </div>
        </form>
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
