import { Bell, CheckCircle, MessageSquare } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New Message",
      description: "You received a new message from John",
      time: "2m ago",
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    },
    {
      id: 2,
      type: "alert",
      title: "System Update",
      description: "Your profile was successfully updated",
      time: "10m ago",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    },
    {
      id: 3,
      type: "reminder",
      title: "Meeting Reminder",
      description: "You have a meeting scheduled at 3:00 PM",
      time: "1h ago",
      icon: <Bell className="w-6 h-6 text-yellow-500" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="bg-white rounded-2xl shadow p-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-4 py-4 hover:bg-gray-50 rounded-lg px-2 cursor-pointer"
          >
            {/* Icon */}
            <div className="flex-shrink-0">{n.icon}</div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-gray-900 font-semibold">{n.title}</h2>
              <p className="text-gray-600 text-sm">{n.description}</p>
              <span className="text-xs text-gray-400">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
