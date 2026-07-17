import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Database,
  Server,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { dashboardService } from "../services/DashboardService";

export const Settings = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: dashboardService.getStats,
    retry: false,
  });

  const stats = [
    {
      title: "Total Classes",
      value: data?.totalClasses ?? 0,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Waitlist Entries",
      value: data?.totalWaitlist ?? 0,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Notifications Sent",
      value: data?.totalNotifications ?? 0,
      icon: Bell,
      color: "text-purple-600",
    },
    {
      title: "Pending",
      value: data?.pending ?? 0,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Delivered",
      value: data?.delivered ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600",
    },
    {
      title: "Failed",
      value: data?.failed ?? 0,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900">
          Reports & Analytics
        </h1>

        <p className="text-primary-600 mt-2">
          Overview of classes, waitlist activity and SMS notifications.
        </p>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            Loading dashboard statistics...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            Unable to load live statistics. Showing default values.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="bg-gray-100 rounded-full p-4">
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      
    </div>
  );
};