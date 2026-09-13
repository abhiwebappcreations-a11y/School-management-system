import React, { useState, useEffect } from 'react';
import {
  Bus,
  MapPin,
  Users,
  Phone,
  Navigation,
  CheckCircle2,
  Radio,
  Clock,
  ShieldCheck,
  Gauge,
  Fuel,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Compass,
  Check,
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const TransportModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { canAccess, effectiveDevice } = useAuth();
  const [selectedRouteId, setSelectedRouteId] = useState('route-1');

  // GPS Telemetry State
  const [activeStopIndex, setActiveStopIndex] = useState(1);
  const [speedKmh, setSpeedKmh] = useState(38);
  const [fuelPercent, setFuelPercent] = useState(74);
  const [isSosActive, setIsSosActive] = useState(false);
  const [trafficAlert, setTrafficAlert] = useState<string | null>(null);

  const route = db.routes.find((r) => r.id === selectedRouteId) || db.routes[0];
  const assignedStudents = db.studentTransport.filter((s) => s.routeId === route.id);

  // Subtle speed fluctuation simulation when en route
  useEffect(() => {
    if (route.status !== 'En Route') return;
    const interval = setInterval(() => {
      setSpeedKmh((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(42, Math.max(25, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [route.status]);

  const toggleTrip = () => {
    const nextStatus = route.status === 'En Route' ? 'Completed' : 'En Route';
    mutateDb((draft) => {
      const r = draft.routes.find((x) => x.id === route.id);
      if (r) r.status = nextStatus;
    });
    if (nextStatus === 'En Route') {
      showToast('Trip Commenced', `Bus ${route.busNumber} started GPS telemetry on ${route.routeNumber}.`, 'success');
    } else {
      showToast('Trip Completed', `Bus ${route.busNumber} arrived at Delhi Smart Academy campus.`, 'info');
      setActiveStopIndex(route.stops.length - 1);
    }
  };

  const advanceNextStop = () => {
    if (activeStopIndex >= route.stops.length - 1) {
      showToast('End of Route', 'Bus has reached Delhi Smart Academy Campus.', 'info');
      return;
    }

    const nextIndex = activeStopIndex + 1;
    setActiveStopIndex(nextIndex);
    const stop = route.stops[nextIndex];

    // Mark students at this stop as picked up
    mutateDb((draft) => {
      draft.studentTransport.forEach((st) => {
        if (st.routeId === route.id && st.stopName === stop.stopName) {
          st.pickupStatus = 'Picked Up';
        }
      });
    });

    showToast(
      'Stop Reached!',
      `Arrived at ${stop.stopName}. ${stop.studentCount} students boarded. Automated parent SMS sent.`,
      'success'
    );
  };

  const toggleStudentBoarding = (studentTransportId: string) => {
    mutateDb((draft) => {
      const st = draft.studentTransport.find((x) => x.id === studentTransportId);
      if (st) {
        st.pickupStatus = st.pickupStatus === 'Picked Up' ? 'Waiting' : 'Picked Up';
      }
    });
  };

  const triggerSosProtocol = () => {
    setIsSosActive(true);
    showToast('SOS ALARM TRIGGERED', 'Emergency alert dispatched to Central Security & Fleet HQ!', 'error');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bus className="w-6 h-6 text-amber-500" />
            Transport Fleet, Route Optimization & GPS Telematics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time GPS telematics, speed governors, geofenced stops, and RFID student boarding tracker.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            icon={ShieldAlert}
            onClick={triggerSosProtocol}
          >
            Driver SOS Panic
          </Button>

          <Button
            variant={route.status === 'En Route' ? 'success' : 'primary'}
            size="sm"
            icon={Navigation}
            onClick={toggleTrip}
          >
            {route.status === 'En Route' ? 'End Trip at Campus' : 'Start Morning Run'}
          </Button>
        </div>
      </div>

      {/* Routes Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {db.routes.map((r) => (
          <Card
            key={r.id}
            hoverable
            onClick={() => {
              setSelectedRouteId(r.id);
              setActiveStopIndex(1);
            }}
            className={`p-4 border-2 transition-all ${
              selectedRouteId === r.id
                ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <Badge variant={r.status === 'En Route' ? 'warning' : 'success'} size="sm">
                  {r.status === 'En Route' ? <Radio className="w-3 h-3 animate-ping mr-1" /> : null}
                  {r.status.toUpperCase()}
                </Badge>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {r.routeNumber} — {r.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bus: <strong className="font-mono text-slate-700 dark:text-slate-300">{r.busNumber}</strong> • Driver: {r.driverName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {r.assignedStudentsCount} / {r.totalCapacity}
                </span>
                <span className="text-[10px] text-slate-400 block">Students Onboard</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Live GPS Telemetry Dashboard Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">GPS Speed</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {route.status === 'En Route' ? speedKmh : 0}
            </span>
            <span className="text-xs text-slate-400">km/h</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">Governor Limit: 40 km/h (CBSE Compliant)</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fuel Level</span>
            <Fuel className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{fuelPercent}%</span>
            <span className="text-xs text-slate-400">Diesel</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Est. Range: 240 km</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Stop ETA</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {activeStopIndex >= route.stops.length - 1 ? 'Campus' : '4 mins'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate mt-1">
            Approaching: {route.stops[Math.min(activeStopIndex + 1, route.stops.length - 1)]?.stopName}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hardware Telemetry</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">Active</span>
          </div>
          <p className="text-[10px] text-indigo-600 font-bold mt-1">CCTV + AIS-140 GPS Synced</p>
        </Card>
      </div>

      {/* Interactive Animated Route Map Simulation */}
      <Card className="p-6 space-y-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Live Route Telematics Map — {route.routeNumber}
            </h3>
            <p className="text-xs text-slate-500">
              Interactive corridor visualization with live geofenced stops and automated arrival dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTrafficAlert('Heavy congestion detected near Ring Road Flyover (+6 mins)');
                showToast('Traffic Alert', 'Notified route coordinator of minor traffic delay.', 'warning');
              }}
            >
              Simulate Traffic
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={advanceNextStop}
            >
              Advance to Next Stop
            </Button>
          </div>
        </div>

        {trafficAlert && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{trafficAlert}</span>
            </div>
            <button
              onClick={() => setTrafficAlert(null)}
              className="text-[11px] font-bold text-amber-900 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Visual Simulated Route Road with Moving School Bus */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-white relative overflow-hidden">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

          {/* Road Corridor */}
          <div className="relative py-8">
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-indigo-500 transition-all duration-700 rounded-full"
                style={{
                  width: `${(activeStopIndex / (route.stops.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Stops Along Corridor */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2">
              {route.stops.map((stop, idx) => {
                const isPassed = idx <= activeStopIndex;
                const isCurrent = idx === activeStopIndex;

                return (
                  <div key={stop.order} className="flex flex-col items-center group relative">
                    {/* Pulsing Bus Icon on Active Stop */}
                    {isCurrent && (
                      <div className="absolute -top-10 flex flex-col items-center animate-bounce">
                        <div className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-lg flex items-center gap-1">
                          <Bus className="w-3 h-3" />
                          <span>BUS {route.busNumber}</span>
                        </div>
                        <div className="w-2 h-2 bg-amber-400 rotate-45 -mt-1" />
                      </div>
                    )}

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3" /> : stop.order}
                    </div>

                    <span className="text-[11px] font-bold text-slate-200 mt-2 text-center max-w-[90px] truncate">
                      {stop.stopName}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">{stop.pickupTime}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stops Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {route.stops.map((stop, idx) => (
            <div
              key={stop.order}
              className={`p-3.5 rounded-2xl border transition-all ${
                idx === activeStopIndex
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-400">STOP #{stop.order}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  {stop.pickupTime}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                {stop.stopName}
              </h4>
              <div className="mt-3 pt-2 border-t text-[11px] text-slate-500 flex justify-between">
                <span>Boarding:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {stop.studentCount} students
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Allocated Student Manifest Table with Boarding Toggle */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Allocated Students on {route.routeNumber} ({assignedStudents.length} Assigned)
            </h3>
            <p className="text-xs text-slate-500">
              Live RFID & manual conductor roll call check-in
            </p>
          </div>

          <Badge variant="info">
            {assignedStudents.filter((s) => s.pickupStatus === 'Picked Up').length} / {assignedStudents.length} Boarded
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Designated Stop</th>
                <th className="py-3 px-4">Pickup Time</th>
                <th className="py-3 px-4 text-right">Pickup Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {assignedStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{st.studentName}</td>
                  <td className="py-3 px-4 text-slate-500">{st.classSection}</td>
                  <td className="py-3 px-4 font-medium">{st.stopName}</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400">{st.pickupTime}</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={st.pickupStatus === 'Picked Up' ? 'success' : 'warning'}>
                      {st.pickupStatus.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleStudentBoarding(st.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        st.pickupStatus === 'Picked Up'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      }`}
                    >
                      {st.pickupStatus === 'Picked Up' ? 'Boarded ✓' : 'Mark Boarded'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SOS Emergency Modal */}
      {isSosActive && (
        <Modal
          isOpen={true}
          onClose={() => setIsSosActive(false)}
          title="EMERGENCY SOS PANIC PROTOCOL ACTIVATED"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Distress Telemetry Active</span>
              </div>
              <p>
                Emergency distress beacon transmitted for <strong>{route.busNumber}</strong> ({route.routeNumber}). Central Security Station and Transport Manager alerted with live coordinates.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Driver:</span>
                <span className="font-bold">{route.driverName} ({route.driverPhone})</span>
              </div>
              <div className="flex justify-between">
                <span>GPS Location:</span>
                <span className="font-mono">28.6139° N, 77.2090° E (Ring Road)</span>
              </div>
              <div className="flex justify-between">
                <span>Students Onboard:</span>
                <span className="font-bold text-indigo-600">{assignedStudents.length} Students</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsSosActive(false);
                  showToast('SOS Cleared', 'Emergency protocol stood down.', 'info');
                }}
              >
                Clear Emergency Alert
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
