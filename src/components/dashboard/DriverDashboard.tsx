import React, { useState } from 'react';
import {
  Bus,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Radio,
  Navigation,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const DriverDashboard: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { effectiveDevice } = useAuth();

  const route = db.routes.find((r) => r.id === 'route-4') || db.routes[0];
  const [tripStatus, setTripStatus] = useState(route.status);
  const [currentStopIndex, setCurrentStopIndex] = useState(1);

  const toggleStudentStatus = (studentTransportId: string) => {
    mutateDb((draft) => {
      const st = draft.studentTransport.find((s) => s.id === studentTransportId);
      if (st) {
        st.pickupStatus = st.pickupStatus === 'Picked Up' ? 'Waiting' : 'Picked Up';
      }
    });
    showToast('Pickup Updated', 'Student boarding status synchronized to transport dispatch', 'success');
  };

  const updateTripStatus = (newStatus: 'Idle' | 'En Route' | 'Completed') => {
    setTripStatus(newStatus);
    mutateDb((draft) => {
      const r = draft.routes.find((x) => x.id === route.id);
      if (r) r.status = newStatus;
    });
    showToast('Trip Status Updated', `Route 04 is now ${newStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Driver Mobile-Optimized Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="warning" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                Active Fleet Telematics
              </Badge>
              <span className="text-xs text-amber-200/80">Bus: {route.busNumber}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">{route.routeNumber} — {route.name}</h1>
            <p className="text-xs text-amber-100/90 mt-1">
              Driver: Manoj Singh • Attendant: {route.attendantName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={tripStatus === 'En Route' ? 'success' : 'primary'}
              size="sm"
              icon={Navigation}
              onClick={() => updateTripStatus(tripStatus === 'En Route' ? 'Completed' : 'En Route')}
            >
              {tripStatus === 'En Route' ? 'Mark Completed' : 'Start Morning Trip'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={AlertTriangle}
              onClick={() => showToast('SOS Alert Transmitted', 'Emergency coordinates sent to school security center', 'error')}
            >
              SOS Alert
            </Button>
          </div>
        </div>
      </div>

      {/* Live Route Tracker Widget */}
      <Card>
        <CardHeader
          title="Trip Progression & Stops"
          subtitle="Real-time bus coordinates along Route 04"
          action={
            <Badge variant="success" size="md">
              <Radio className="w-3 h-3 animate-pulse" /> LIVE TELEMATICS
            </Badge>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 py-2">
          {route.stops.map((stop, idx) => (
            <div
              key={stop.order}
              className={`p-3.5 rounded-2xl border transition-all ${
                idx === currentStopIndex
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-sm'
                  : idx < currentStopIndex
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-500">Stop #{stop.order}</span>
                <span className="text-[10px] text-slate-400 font-mono">{stop.pickupTime}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                {stop.stopName}
              </h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px]">
                <span className="text-slate-500">{stop.studentCount} Students</span>
                {idx === currentStopIndex ? (
                  <Badge variant="warning" size="sm">Current</Badge>
                ) : idx < currentStopIndex ? (
                  <Badge variant="success" size="sm">Departed</Badge>
                ) : (
                  <Badge variant="neutral" size="sm">Upcoming</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Assigned Students Pickup Checklist */}
      <Card>
        <CardHeader
          title="Assigned Students Boarding Manifest"
          subtitle="Tap to toggle student boarding status at stops"
        />
        <div className="space-y-2.5">
          {db.studentTransport.map((st) => (
            <div
              key={st.id}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    st.pickupStatus === 'Picked Up'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{st.studentName}</h4>
                  <p className="text-xs text-slate-500">{st.classSection} • {st.stopName}</p>
                  <span className="text-[10px] text-slate-400 font-mono">Scheduled: {st.pickupTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={st.pickupStatus === 'Picked Up' ? 'success' : 'warning'}>
                  {st.pickupStatus.toUpperCase()}
                </Badge>
                <Button
                  size="sm"
                  variant={st.pickupStatus === 'Picked Up' ? 'outline' : 'primary'}
                  onClick={() => toggleStudentStatus(st.id)}
                >
                  {st.pickupStatus === 'Picked Up' ? 'Mark Waiting' : 'Mark Picked Up'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
