import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { waitlistService } from "../services/waitlistService";
import { classService } from "../services/classService";
import { notificationService } from "../services/notificationService";

import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Toast } from "../components/ui/Toast";

import { Plus, Search, Bell } from "lucide-react";

import { formatPhoneNumber } from "../utils/formatters";

export const Waitlist = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState(false);

  const [selectedEntry, setSelectedEntry] = useState(null);

  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    classId: "",
    userName: "",
    phoneNumber: "",
    status: "pending",
  });

  const [notificationData, setNotificationData] = useState({
    waitlistId: "",
    message: "",
  });

  const {
    data: waitlist = [],
    isLoading,
  } = useQuery({
    queryKey: ["waitlist"],
    queryFn: waitlistService.getAll,
  });

  const {
    data: classes = [],
  } = useQuery({
    queryKey: ["classes"],
    queryFn: classService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: waitlistService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["waitlist"],
      });

      setToast({
        message: "Added to waitlist successfully",
        type: "success",
      });

      setFormData({
        classId: "",
        userName: "",
        phoneNumber: "",
        status: "pending",
      });

      setIsCreateModalOpen(false);
    },

    onError: () => {
      setToast({
        message: "Failed to add waitlist entry",
        type: "error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      waitlistService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["waitlist"],
      });

      setToast({
        message: "Waitlist updated successfully",
        type: "success",
      });

      setSelectedEntry(null);
      setIsUpdateModalOpen(false);
    },

    onError: () => {
      setToast({
        message: "Failed to update waitlist entry",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: waitlistService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["waitlist"],
      });

      setToast({
        message: "Removed from waitlist successfully",
        type: "success",
      });

      setSelectedEntry(null);
      setIsDeleteModalOpen(false);
    },

    onError: () => {
      setToast({
        message: "Failed to remove waitlist entry",
        type: "error",
      });
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: notificationService.send,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      setToast({
        message: "SMS notification sent successfully",
        type: "success",
      });

      setNotificationData({
        waitlistId: "",
        message: "",
      });

      setIsNotificationModalOpen(false);
    },

    onError: () => {
      setToast({
        message: "Failed to send notification",
        type: "error",
      });
    },
  });
    const filteredWaitlist = waitlist.filter(
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
      classId: entry.classId,
      userName: entry.userName,
      phoneNumber: entry.phoneNumber,
      status: entry.status,
    });

    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (entry) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const openNotificationModal = (entry) => {
    setSelectedEntry(entry);

    setNotificationData({
      waitlistId: entry.id,
      message: "",
    });

    setIsNotificationModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const tableColumns = [
    {
      key: "userName",
      header: "Student",
    },
    {
      key: "phoneNumber",
      header: "Phone",
    },
    {
      key: "className",
      header: "Class",
    },
    {
      key: "position",
      header: "Position",
    },
    {
      key: "status",
      header: "Status",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="px-3 py-1"
            onClick={() => openUpdateModal(row.item)}
          >
            Edit
          </Button>

          <Button
            className="px-3 py-1"
            onClick={() => openNotificationModal(row.item)}
          >
            <Bell className="mr-1 h-4 w-4" />
            Notify
          </Button>

          <Button
            variant="danger"
            className="px-3 py-1"
            onClick={() => openDeleteModal(row.item)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const tableData = filteredWaitlist.map((entry) => ({
    item: entry,
    userName: entry.userName,
    phoneNumber: formatPhoneNumber(entry.phoneNumber),
    className: entry.class?.className || "N/A",
    position: entry.position,
    status: entry.status,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-900">
          Waitlist
        </h1>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add to Waitlist
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-primary-500" />

            <Input
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="flex-1"
            />
          </div>

          {tableData.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No waitlist entries found.
            </div>
          ) : (
            <Table
              columns={tableColumns}
              data={tableData}
            />
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add to Waitlist"
      >
        <form
          onSubmit={handleCreate}
          className="space-y-4"
        >
                  <div>
            <label className="mb-2 block text-sm font-medium">
              Class
            </label>

            <select
              value={formData.classId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  classId: e.target.value,
                })
              }
              className="w-full rounded-lg border p-2"
              required
            >
              <option value="">Select Class</option>

              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.className}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Student Name"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value,
              })
            }
            required
          />

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                phoneNumber: e.target.value,
              })
            }
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={createMutation.isPending}
            >
              Add
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Waitlist"
      >
        <form
          onSubmit={handleUpdate}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="w-full rounded-lg border p-2"
            >
              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </div>

          <Input
            label="Student Name"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value,
              })
            }
          />

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                phoneNumber: e.target.value,
              })
            }
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setIsUpdateModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={updateMutation.isPending}
            >
              Update
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove Waitlist Entry"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to remove
            <strong>
              {" "}
              {selectedEntry?.userName}
            </strong>
            ?
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setIsDeleteModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() =>
          setIsNotificationModalOpen(false)
        }
        title="Send SMS Notification"
      >
        <div className="space-y-4">

          <Input
            label="Student"
            value={selectedEntry?.userName || ""}
            disabled
          />

          <Input
            label="Class"
            value={
              selectedEntry?.class?.className || ""
            }
            disabled
          />

          <Input
            label="Phone Number"
            value={
              selectedEntry?.phoneNumber || ""
            }
            disabled
          />

          <textarea
            rows={4}
            className="w-full rounded-lg border p-3"
            placeholder="Enter SMS message..."
            value={notificationData.message}
            onChange={(e) =>
              setNotificationData({
                ...notificationData,
                message: e.target.value,
              })
            }
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setIsNotificationModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              isLoading={
                sendNotificationMutation.isPending
              }
              onClick={() =>
                sendNotificationMutation.mutate(
                  notificationData
                )
              }
            >
              Send SMS
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
