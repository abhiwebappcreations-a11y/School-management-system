import React, { useState } from 'react';
import {
  Building2,
  Users,
  Thermometer,
  Wind,
  Lightbulb,
  Tv,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { RoomOccupancy } from '../../../types/enterprise';
import { EnterpriseState } from '../../../services/enterpriseStore';
import { Modal } from '../../common/Modal';

export const DigitalTwinModule: React.FC = () => {
  const { state, toggleRoomLight, toggleRoomProjector, updateRoomStatus, mutate } = useEnterprise();
  const { showToast } = useSchool();
  const { currentUser, effectiveDevice } = useAuth();

  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedRoom, setInspectedRoom] = useState<RoomOccupancy | null>(null);
  const [isLockdownActive, setIsLockdownActive] = useState<boolean>(false);

  // Filtered rooms
  const rooms = state.rooms.filter((room) => {
    const matchesBuilding = selectedBuilding === 'all' || room.building === selectedBuilding;
    const matchesFloor = selectedFloor === 'all' || room.floor === selectedFloor;
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.assignedClass && room.assignedClass.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room.currentTeacher && room.currentTeacher.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBuilding && matchesFloor && matchesSearch;
  });

  // Telemetry Aggregates
  const totalCapacity = state.rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = state.rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);
  const campusOccupancyRate = Math.round((totalOccupied / (totalCapacity || 1)) * 100);
  const activeClassesCount = state.rooms.filter((r) => r.status === 'occupied').length;
  const avgTemp = (state.rooms.reduce((acc, r) => acc + r.temperatureC, 0) / (state.rooms.length || 1)).toFixed(1);
  const avgCo2 = Math.round(state.rooms.reduce((acc, r) => acc + r.co2Ppm, 0) / (state.rooms.length || 1));

  const handleToggleLight = (room: RoomOccupancy) => {
    toggleRoomLight(room.id);
    showToast(
      'Lighting System Updated',
      `${room.name} lights turned ${!room.lightsOn ? 'ON' : 'OFF'}.`,
      'info'
    );
  };

  const handleToggleProjector = (room: RoomOccupancy) => {
    toggleRoomProjector(room.id);
    showToast(
      'Smart AV Terminal Updated',
      `${room.name} interactive projector turned ${!room.projectorOn ? 'ON' : 'OFF'}.`,
      'info'
    );
  };

  const handleStatusChange = (roomId: string, newStatus: RoomOccupancy['status']) => {
    updateRoomStatus(roomId, newStatus);
    if (inspectedRoom && inspectedRoom.id === roomId) {
      setInspectedRoom({ ...inspectedRoom, status: newStatus });
    }
    showToast('Room Status Updated', `Room status changed to ${newStatus.toUpperCase()}`, 'success');
  };

  const handleSimulateLockdown = () => {
    const nextState = !isLockdownActive;
    setIsLockdownActive(nextState);

    mutate((draft: EnterpriseState) => {
      draft.rooms.forEach((r) => {
        if (nextState) {
          r.projectorOn = false;
        }
      });
    });

    showToast(
      nextState ? 'CAMPUS LOCKDOWN SIMULATED' : 'ALL-CLEAR DECLARED',
      nextState
        ? 'Perimeter secured. Smart doors locked. Telemetry routed to Executive Command.'
        : 'Normal operations resumed across all campus zones.',
      nextState ? 'warning' : 'success'
    );
  };

  const getStatusBadge = (status: RoomOccupancy['status']) => {
    switch (status) {
      case 'occupied':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>In Session</span>;
      case 'vacant':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Vacant</span>;
      case 'cleaning':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Sanitizing</span>;
      case 'maintenance':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">Maintenance</span>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Emergency Alert Banner if lockdown simulated */}
      {isLockdownActive && (
        <div className="p-4 rounded-xl bg-rose-600 text-white flex items-center justify-between shadow-lg animate-bounce duration-1000">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-100 animate-spin" />
            <div>
              <h4 className="font-bold text-lg">CAMPUS EMERGENCY PROTOCOL ACTIVE — PERIMETER SEALED</h4>
              <p className="text-rose-100 text-xs md:text-sm">All classroom access biometric locks engaged. Fire barriers standby. Live CCTV routed to IT Command.</p>
            </div>
          </div>
          <button
            onClick={handleSimulateLockdown}
            className="px-4 py-2 bg-white text-rose-700 rounded-lg font-bold text-xs hover:bg-rose-50 shadow"
          >
            Cancel Lockdown
          </button>
        </div>
      )}

      {/* Header & High-Level Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Campus Digital Twin
                <span className="text-xs px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold rounded-full border border-indigo-200 dark:border-indigo-800">
                  Real-time IoT v2.4
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                Live spatial telemetry, environmental sensor mesh, smart energy controls & occupancy heatmaps.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSimulateLockdown}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
              isLockdownActive
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            {isLockdownActive ? 'Emergency Lockdown Active' : 'Simulate Campus Lockdown'}
          </button>

          <button
            onClick={() => showToast('Sensor Mesh Polled', 'Synced 48 IoT sensor nodes across 3 campus wings.', 'success')}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Mesh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Campus Occupancy</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalOccupied} / {totalCapacity}
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-1.5">
                ({campusOccupancyRate}%)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active In-Session Spaces</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {activeClassesCount} / {state.rooms.length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Campus Temperature</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {avgTemp}°C
              <span className="text-xs text-slate-400 font-normal ml-1">Optimal (22°C)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Indoor Air Quality (CO₂)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {avgCo2} ppm
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold ml-1">Fresh Air</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Room number, Name, Teacher or Subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Building:
          </div>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Campus Wings</option>
            <option value="Main Academic Wing">Main Academic Wing</option>
            <option value="STEM & Innovation Block">STEM & Innovation Block</option>
            <option value="Arts & Sports Arena">Arts & Sports Arena</option>
          </select>

          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Floors</option>
            <option value="Ground">Ground Floor</option>
            <option value="1st Floor">1st Floor</option>
            <option value="2nd Floor">2nd Floor</option>
          </select>
        </div>
      </div>

      {/* Interactive Spatial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const occupancyPercent = Math.round((room.currentOccupancy / room.capacity) * 100);
          const isHighCo2 = room.co2Ppm > 700;

          return (
            <div
              key={room.id}
              className={`p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${
                room.status === 'occupied'
                  ? 'border-indigo-200 dark:border-indigo-900/60'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Room Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {room.roomNumber}
                    </span>
                    {getStatusBadge(room.status)}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {room.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {room.building} • {room.floor}
                  </div>
                </div>

                <button
                  onClick={() => setInspectedRoom(room)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Inspect Spatial Telemetry"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Class & Teacher Details */}
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Class / Section:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{room.assignedClass || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Instructor:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{room.currentTeacher || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Activity:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{room.currentSubject || 'General'}</span>
                </div>
              </div>

              {/* Occupancy Heatmap Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Occupancy</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {room.currentOccupancy} / {room.capacity} ({occupancyPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancyPercent > 90
                        ? 'bg-rose-500'
                        : occupancyPercent > 70
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                  />
                </div>
              </div>

              {/* IoT Telemetry Strip */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>{room.temperatureC}°C</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Wind className={`w-3.5 h-3.5 ${isHighCo2 ? 'text-rose-500' : 'text-teal-500'}`} />
                  <span>{room.co2Ppm} ppm CO₂</span>
                </div>
              </div>

              {/* Interactive Smart Hardware Switches */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLight(room)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      room.lightsOn
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                    title="Toggle Lighting"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    {room.lightsOn ? 'Lights On' : 'Lights Off'}
                  </button>

                  <button
                    onClick={() => handleToggleProjector(room)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      room.projectorOn
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                    title="Toggle Smart Display / Projector"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    {room.projectorOn ? 'AV Active' : 'AV Standby'}
                  </button>
                </div>

                <button
                  onClick={() => setInspectedRoom(room)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Inspect →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detailed Inspection Modal */}
      {inspectedRoom && (
        <Modal
          isOpen={true}
          onClose={() => setInspectedRoom(null)}
          title={`Room Telemetry & Controls: ${inspectedRoom.name} (${inspectedRoom.roomNumber})`}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-base">{inspectedRoom.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {inspectedRoom.building} • {inspectedRoom.floor} • Room {inspectedRoom.roomNumber}
                </div>
              </div>
              <div>{getStatusBadge(inspectedRoom.status)}</div>
            </div>

            {/* Environmental Sensors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-medium">Room Temp</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{inspectedRoom.temperatureC}°C</div>
                <div className="text-[11px] text-emerald-600 font-semibold">Climate Control Active</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-medium">CO₂ Concentration</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{inspectedRoom.co2Ppm} ppm</div>
                <div className="text-[11px] text-teal-600 font-semibold">Healthy Circulation</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-medium">Student Occupancy</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {inspectedRoom.currentOccupancy} / {inspectedRoom.capacity}
                </div>
                <div className="text-[11px] text-indigo-600 font-semibold">{Math.round((inspectedRoom.currentOccupancy / inspectedRoom.capacity) * 100)}% Capacity</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 font-medium">Smart Devices</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {inspectedRoom.lightsOn ? '1 Bulb' : '0'} + {inspectedRoom.projectorOn ? '1 AV' : '0'}
                </div>
                <div className="text-[11px] text-slate-500">Connected IoT</div>
              </div>
            </div>

            {/* Change Status Controls */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Override Space Status
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['occupied', 'vacant', 'cleaning', 'maintenance'] as RoomOccupancy['status'][]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(inspectedRoom.id, st)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      inspectedRoom.status === st
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Hardware Toggles */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-3">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Remote Hardware Switches
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className={`w-4 h-4 ${inspectedRoom.lightsOn ? 'text-amber-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">LED Array (4000K Daylight)</div>
                    <div className="text-xs text-slate-400">Energy saving mode enabled</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleToggleLight(inspectedRoom);
                    setInspectedRoom({ ...inspectedRoom, lightsOn: !inspectedRoom.lightsOn });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    inspectedRoom.lightsOn
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {inspectedRoom.lightsOn ? 'Power Off' : 'Power On'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Tv className={`w-4 h-4 ${inspectedRoom.projectorOn ? 'text-indigo-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Interactive Touch Wall & 4K Projector</div>
                    <div className="text-xs text-slate-400">Wireless Miracast & AirPlay ready</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleToggleProjector(inspectedRoom);
                    setInspectedRoom({ ...inspectedRoom, projectorOn: !inspectedRoom.projectorOn });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    inspectedRoom.projectorOn
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {inspectedRoom.projectorOn ? 'Standby' : 'Start AV'}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectedRoom(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-300"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default DigitalTwinModule;
