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
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';

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
        return <Badge variant="emerald" dot>In Session</Badge>;
      case 'vacant':
        return <Badge variant="slate">Vacant</Badge>;
      case 'cleaning':
        return <Badge variant="amber" dot>Sanitizing</Badge>;
      case 'maintenance':
        return <Badge variant="rose" dot>Maintenance</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Emergency Alert Banner if lockdown simulated */}
      {isLockdownActive && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white flex items-center justify-between shadow-xl shadow-rose-500/20 border border-rose-400/40 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-white animate-spin" />
            </div>
            <div>
              <h4 className="font-black text-lg tracking-tight">CAMPUS EMERGENCY PROTOCOL ACTIVE — PERIMETER SEALED</h4>
              <p className="text-rose-100 text-xs md:text-sm">All classroom access biometric locks engaged. Fire barriers standby. Live CCTV routed to IT Command.</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSimulateLockdown}
            className="bg-white text-rose-700 hover:bg-rose-50 font-black shadow-lg"
          >
            Cancel Lockdown
          </Button>
        </div>
      )}

      {/* Header & High-Level Telemetry */}
      <Card variant="glass" className="p-5 md:p-6 border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-br from-indigo-500/10 via-teal-500/5 to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl text-white shadow-lg shadow-indigo-500/25">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Campus Digital Twin
                  </h1>
                  <Badge variant="indigo" dot>
                    Real-time IoT v2.4
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Live spatial telemetry, environmental sensor mesh, smart energy controls & occupancy heatmaps.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant={isLockdownActive ? 'danger' : 'secondary'}
              size="sm"
              icon={<ShieldAlert className="w-4 h-4" />}
              onClick={handleSimulateLockdown}
            >
              {isLockdownActive ? 'Emergency Lockdown Active' : 'Simulate Campus Lockdown'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => showToast('Sensor Mesh Polled', 'Synced 48 IoT sensor nodes across 3 campus wings.', 'success')}
            >
              Refresh Mesh
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card variant="glass" hover className="p-4 border-slate-200/70 dark:border-slate-800/70 flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Campus Occupancy</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
              {totalOccupied} / {totalCapacity}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-1.5">
                ({campusOccupancyRate}%)
              </span>
            </div>
          </div>
        </Card>

        <Card variant="glass" hover className="p-4 border-slate-200/70 dark:border-slate-800/70 flex items-center gap-3.5">
          <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Spaces</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
              {activeClassesCount} / {state.rooms.length}
            </div>
          </div>
        </Card>

        <Card variant="glass" hover className="p-4 border-slate-200/70 dark:border-slate-800/70 flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Temperature</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
              {avgTemp}°C
              <span className="text-xs text-slate-400 font-normal ml-1">(Optimal)</span>
            </div>
          </div>
        </Card>

        <Card variant="glass" hover className="p-4 border-slate-200/70 dark:border-slate-800/70 flex items-center gap-3.5">
          <div className="p-3 bg-teal-500/10 dark:bg-teal-500/20 rounded-2xl text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-2xs">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Indoor Air Quality</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
              {avgCo2} ppm
              <span className="text-xs text-teal-600 dark:text-teal-400 font-bold ml-1">Fresh</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="glass" className="p-4 border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Room number, Name, Teacher or Subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Building:
          </div>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-3 py-2 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Campus Wings</option>
            <option value="Main Academic Wing">Main Academic Wing</option>
            <option value="STEM & Innovation Block">STEM & Innovation Block</option>
            <option value="Arts & Sports Arena">Arts & Sports Arena</option>
          </select>

          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="px-3 py-2 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Floors</option>
            <option value="Ground">Ground Floor</option>
            <option value="1st Floor">1st Floor</option>
            <option value="2nd Floor">2nd Floor</option>
          </select>
        </div>
      </Card>

      {/* Interactive Spatial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const occupancyPercent = Math.round((room.currentOccupancy / room.capacity) * 100);
          const isHighCo2 = room.co2Ppm > 700;
          const isOccupied = room.status === 'occupied';

          return (
            <Card
              key={room.id}
              variant="glass"
              hover
              className={`p-5 relative transition-all duration-300 ${
                isOccupied
                  ? 'border-indigo-500/30 dark:border-indigo-500/30 ring-1 ring-indigo-500/20 shadow-indigo-500/5'
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Room Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {room.roomNumber}
                    </span>
                    {getStatusBadge(room.status)}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5 leading-snug tracking-tight">
                    {room.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {room.building} • {room.floor}
                  </div>
                </div>

                <button
                  onClick={() => setInspectedRoom(room)}
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  title="Inspect Spatial Telemetry"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Class & Teacher Details */}
              <div className="mt-4 p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs">
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
                <div className="h-2 w-full bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 shadow-2xs ${
                      occupancyPercent > 90
                        ? 'bg-gradient-to-r from-rose-500 to-red-600'
                        : occupancyPercent > 70
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    }`}
                    style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                  />
                </div>
              </div>

              {/* IoT Telemetry Strip */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>{room.temperatureC}°C</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <Wind className={`w-3.5 h-3.5 ${isHighCo2 ? 'text-rose-500' : 'text-teal-500'}`} />
                  <span>{room.co2Ppm} ppm CO₂</span>
                </div>
              </div>

              {/* Interactive Smart Hardware Switches */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLight(room)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                      room.lightsOn
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                    title="Toggle Lighting"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    {room.lightsOn ? 'Lights On' : 'Lights Off'}
                  </button>

                  <button
                    onClick={() => handleToggleProjector(room)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                      room.projectorOn
                        ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-300 border border-indigo-300/60 dark:border-indigo-800/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                    title="Toggle Smart Display / Projector"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    {room.projectorOn ? 'AV Active' : 'AV Standby'}
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInspectedRoom(room)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold px-2 py-1"
                >
                  Inspect →
                </Button>
              </div>
            </Card>
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
