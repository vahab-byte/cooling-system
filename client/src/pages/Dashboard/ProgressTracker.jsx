import React from 'react';
import { CheckCircle2, Clock, Truck, Wrench, Settings } from 'lucide-react';

const STATUS_STAGES = [
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { id: 'assigned', label: 'Assigned', icon: Settings },
  { id: 'en_route', label: 'En Route', icon: Truck },
  { id: 'in_progress', label: 'In Progress', icon: Wrench },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 }
];

const ProgressTracker = ({ currentStatus }) => {
  const currentIndex = STATUS_STAGES.findIndex(s => s.id === currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center justify-center font-bold text-sm">
        Service Cancelled
      </div>
    );
  }

  return (
    <div className="relative pt-6 pb-2">
      <div className="absolute top-10 left-6 right-6 h-1 bg-slate-100 rounded-full" />
      <div 
        className="absolute top-10 left-6 h-1 bg-primary rounded-full transition-all duration-1000"
        style={{ width: `calc(${(Math.max(0, currentIndex) / (STATUS_STAGES.length - 1)) * 100}% - 24px)` }}
      />

      <div className="relative flex justify-between">
        {STATUS_STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${
                  isCompleted ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
              >
                <Icon size={16} />
              </div>
              <span className={`mt-3 text-[10px] uppercase tracking-wider font-bold text-center w-16 ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
