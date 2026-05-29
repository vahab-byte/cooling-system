import React, { useEffect, useState } from "react";
import { adminService } from "../../services/api";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Activity,
  Package,
  Calendar,
  Loader2,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple admin role check
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashboardStats, allUsers] = await Promise.all([
          adminService.getDashboard(),
          adminService.getAllUsers(),
        ]);
        setStats(dashboardStats);
        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: CreditCard,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: Activity,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 lg:p-12">
      <div className="max-w-7xl mx-auto pt-24 lg:pt-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Admin Control Panel
          </h1>
          <p className="text-slate-400">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group"
              >
                <div
                  className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl ${kpi.bg} group-hover:scale-150 transition-transform duration-700`}
                />
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center mb-6`}
                  >
                    <Icon className={kpi.color} size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {kpi.title}
                  </h3>
                  <div className="text-3xl font-black text-white">
                    {kpi.value}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Registered Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  <th className="py-6 px-8">User Name</th>
                  <th className="py-6 px-8">Email</th>
                  <th className="py-6 px-8">Role</th>
                  <th className="py-6 px-8">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-5 px-8">
                      <div className="font-bold text-white">
                        {u.full_name || "Anonymous"}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-sm text-slate-400">
                      {u.email}
                    </td>
                    <td className="py-5 px-8">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-sm text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-12 text-center text-slate-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
