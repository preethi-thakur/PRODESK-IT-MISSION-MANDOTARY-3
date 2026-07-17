import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { classService } from '../services/classService';
import { waitlistService } from '../services/waitlistService';
import { notificationService } from '../services/notificationService';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Users, Calendar, MessageSquare, Activity } from 'lucide-react';

export const Dashboard = () => {
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAll,
  });

  const { data: waitlist, isLoading: waitlistLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: waitlistService.getAll,
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAll,
  });

  if (classesLoading || waitlistLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Classes',
      value: classes?.length || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Waitlisted',
      value: waitlist?.length || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Notifications Sent',
      value: notifications?.length || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Recent Activity',
      value: 'Active',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-primary-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-primary-900">Recent Classes</h2>
          </CardHeader>
          <CardContent>
            {classes && classes.length > 0 ? (
              <div className="space-y-3">
                {classes.slice(0, 5).map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-primary-900">{classItem.className}</p>
                      <p className="text-sm text-primary-600">{classItem.instructor}</p>
                    </div>
                    <span className="text-sm text-primary-500">{classItem.capacity} spots</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-primary-500 py-4">No classes found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-primary-900">Recent Notifications</h2>
          </CardHeader>
          <CardContent>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-3 bg-primary-50 rounded-lg">
                    <p className="text-sm font-medium text-primary-900">
                      To: {notification.waitlist?.userName}
                    </p>
                    <p className="text-sm text-primary-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-primary-500 py-4">No notifications found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
