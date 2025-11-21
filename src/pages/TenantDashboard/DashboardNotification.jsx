import { Bell, CheckCircle, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import NotificationApi from "../../apis/notification/notification.api";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const topRef = React.useRef(null);

  const fetchNotifications = async (pageNo = page) => {
    try {
      const notificationApi = new NotificationApi();
      const response = await notificationApi.getAllNotification(pageNo, limit);

      if (response?.status === "success") {
        const { notifications, totalPages } = response.data;
        setNotifications(notifications);
        setTotalPages(totalPages);
      } else {
        console.error("Failed to fetch notifications:", response);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, limit]);

 useEffect(() => {
  if (!loading) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [loading]);


  if (loading) {
    return (
      <div ref={topRef} className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#033E4A]">Notifications</h1>

        <div className="bg-white rounded-2xl shadow p-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-none"
            >
              {/* Icon skeleton */}
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

              {/* Text skeleton */}
              <div className="flex-1 space-y-2">
                <div className="w-40 h-4 bg-gray-200 rounded"></div>
                <div className="w-64 h-3 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="bg-[#033E4A]/10 p-6 rounded-full mb-4">
          <Bell className="w-10 h-10 text-[#033E4A]" />
        </div>
        <h2 className="text-2xl font-bold text-[#033E4A] mb-2">
          No Notifications Yet
        </h2>
        <p className="text-gray-600 max-w-md">
          You’re all caught up! When new updates or messages arrive,
          they’ll show up here automatically.
        </p>
        <button
          onClick={() => fetchNotifications()}
          className="mt-6 px-5 py-2.5 rounded-lg bg-[#033E4A] text-white font-medium hover:bg-[#045666] transition-all"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#033E4A]">Notifications</h1>

      <div className="bg-white rounded-2xl shadow p-4">
        {notifications.map((n) => {
          let icon = <Bell className="w-6 h-6 text-yellow-500" />;
          if (n.type === "Interest")
            icon = <MessageSquare className="w-6 h-6 text-blue-500" />;
          if (n.type === "System")
            icon = <CheckCircle className="w-6 h-6 text-green-500" />;

          return (
            <div
              key={n._id}
              className="flex items-start gap-4 py-4 hover:bg-gray-50 px-2 cursor-pointer border-b border-gray-300 last:border-none"
            >
              <div className="flex-shrink-0">{icon}</div>
              <div className="flex-1">
                <h2 className="text-gray-900 font-semibold">{n.title}</h2>
                <p className="text-gray-600 text-sm">{n.message}</p>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls (Arrow Only) */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          disabled={page === 1}
          onClick={() => {
            setPage((p) => p - 1);
          }}
          className="p-2 rounded-full border border-[#033E4A] text-[#033E4A] hover:bg-[#033E4A]/10 disabled:opacity-40 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm font-medium text-[#033E4A]">
          {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => {
            setPage((p) => p + 1);

          }}
          className="p-2 rounded-full border border-[#033E4A] text-[#033E4A] hover:bg-[#033E4A]/10 disabled:opacity-40 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
