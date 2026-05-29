import React, { useEffect, useState } from "react";
import { adminService, technicianService } from "../../services/api";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Activity,
  Package,
  Calendar,
  Loader2,
  Wrench,
  MapPin,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple admin role check
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashboardStats, allUsers, allTechs] = await Promise.all([
          adminService.getDashboard(),
          adminService.getAllUsers(),
          technicianService.getTechnicians(),
        ]);
        setStats(dashboardStats);
        setUsers(allUsers);
        setFleet(allTechs);
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

        {/* Live Fleet Tracking */}
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mb-12">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wrench className="text-amber-500" /> Live Fleet Tracking
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Monitor your technicians in real-time
              </p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold uppercase tracking-wider rounded-lg">
                {fleet.filter((t) => t.status === "available").length} Available
              </span>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider rounded-lg">
                {fleet.filter((t) => t.status === "busy").length} Busy
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
            {fleet.map((tech) => (
              <div
                key={tech.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${
                    tech.status === "available"
                      ? "bg-green-500"
                      : tech.status === "busy"
                        ? "bg-amber-500"
                        : "bg-slate-600"
                  }`}
                />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0">
                    <img
                      src={
                        tech.avatar_url ||
                        `https://ui-avatars.com/api/?name=${tech.name}&background=1e293b&color=cbd5e1`
                      }
                      alt={tech.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {tech.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tech.status === "available"
                            ? "bg-green-500"
                            : tech.status === "busy"
                              ? "bg-amber-500"
                              : "bg-slate-500"
                        }`}
                      />
                      <span className="text-sm text-slate-400 font-medium capitalize">
                        {tech.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      Jobs Done
                    </div>
                    <div className="text-lg font-bold text-slate-200">
                      {tech.jobs_completed}
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      Rating
                    </div>
                    <div className="text-lg font-bold text-slate-200">
                      ★ {tech.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {fleet.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                No technicians found in the fleet. Link a user profile to a
                technician.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
