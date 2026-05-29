import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Truck,
  Wrench,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/technicians/dashboard");
      if (data.success) {
        setProfile(data.data.profile);
        setActiveJobs(data.data.activeJobs);
      }
    } catch (error) {
      toast.error("Failed to load technician dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/technicians/booking/${bookingId}/status`, {
        status: newStatus,
      });
      toast.success(`Job marked as ${newStatus.replace("_", " ")}`);
      fetchDashboard();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-3">
        <AlertCircle size={24} />
        <div>
          <h3 className="font-bold">No Technician Profile Found</h3>
          <p className="text-sm opacity-90">
            Please contact the admin to link your account to a technician
            record.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 relative shrink-0">
          <img
            src={
              profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${profile.name}&background=eff6ff&color=2563eb`
            }
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
              profile.status === "available"
                ? "bg-green-500"
                : profile.status === "busy"
                  ? "bg-amber-500"
                  : "bg-slate-400"
            }`}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-black text-slate-900">{profile.name}</h1>
          <p className="text-slate-500 font-medium">
            {profile.experience_years} Years Experience • ★ {profile.rating}{" "}
            Rating
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                profile.status === "available"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : profile.status === "busy"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {profile.status}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider rounded-lg">
              {profile.jobs_completed} Jobs Completed
            </span>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Wrench className="text-blue-600" /> Active Assignments
        </h2>

        {activeJobs.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              You have no active assignments right now. Relax, we'll assign you
              automatically when a new booking comes in.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-900/5 border border-slate-100"
              >
                <div className="bg-slate-900 p-6 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                      {job.service_name || "Standard Service"}
                    </span>
                    <h3 className="text-xl font-bold">
                      Booking #{job.id.split("-")[0].toUpperCase()}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm font-medium">
                      Scheduled For
                    </div>
                    <div className="text-lg font-bold flex items-center gap-2">
                      <Calendar size={16} className="text-blue-400" />
                      {new Date(job.booking_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                  {/* Customer Details */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Customer Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {job.customer_name || "Guest User"}
                          </div>
                          <div className="text-sm text-slate-500">Customer</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <MapPin size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-relaxed">
                            {job.address}
                          </div>
                          <div className="text-sm text-slate-500">
                            Service Location
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <Phone size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <a
                            href={`tel:${job.customer_phone}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {job.customer_phone || "Not Provided"}
                          </a>
                          <div className="text-sm text-slate-500">
                            Contact Number
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-6 md:border-l md:border-slate-100 md:pl-8">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Update Status
                    </h4>

                    <div className="grid gap-3">
                      {job.status === "assigned" && (
                        <button
                          disabled={updating}
                          onClick={() => updateStatus(job.id, "en_route")}
                          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/30"
                        >
                          {updating ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              <Truck size={20} /> Mark as En Route
                            </>
                          )}
                        </button>
                      )}

                      {job.status === "en_route" && (
                        <button
                          disabled={updating}
                          onClick={() => updateStatus(job.id, "in_progress")}
                          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/30"
                        >
                          {updating ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              <Wrench size={20} /> Start Service
                            </>
                          )}
                        </button>
                      )}

                      {(job.status === "in_progress" ||
                        job.status === "en_route" ||
                        job.status === "assigned") && (
                        <button
                          disabled={updating}
                          onClick={() => updateStatus(job.id, "completed")}
                          className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-green-500/30"
                        >
                          {updating ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              <CheckCircle size={20} /> Mark as Completed
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                        Current Status
                      </div>
                      <div className="font-bold text-slate-900 capitalize text-lg">
                        {job.status.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
