import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  ShieldCheck,
  Star,
  Plus,
  ShoppingBag,
  Zap,
  TrendingUp,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { StudentGamificationProfile } from '../../../types/enterprise';
import { Modal } from '../../common/Modal';

interface RewardItem {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  badgeRequired?: string;
  icon: string;
}

const REWARD_STORE: RewardItem[] = [
  {
    id: 'rew-1',
    name: '1-Day Homework Extension Pass',
    pointsCost: 500,
    description: 'Redeem for 24-hour grace extension on any non-board homework.',
    icon: '📝',
  },
  {
    id: 'rew-2',
    name: 'Principal’s Leadership Luncheon',
    pointsCost: 1200,
    description: 'Exclusive executive lunch with Head of School Dr. Rajesh Sharma.',
    icon: '🍽️',
  },
  {
    id: 'rew-3',
    name: 'VIP Front-Row Seat at Annual Cultural Fest',
    pointsCost: 800,
    description: 'Reserve prime front seating for student and parents at Kalam Auditorium.',
    icon: '🎭',
  },
  {
    id: 'rew-4',
    name: 'STEM Robotics Lab Weekend Pass',
    pointsCost: 650,
    description: '3 hours open sandbox access with 3D printers and AI compute clusters.',
    icon: '🤖',
  },
];

export const GamificationModule: React.FC = () => {
  const { state, awardPoints } = useEnterprise();
  const { showToast } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-1');
  const [isAwardModalOpen, setIsAwardModalOpen] = useState<boolean>(false);

  // Award modal form
  const [targetStudentId, setTargetStudentId] = useState<string>('std-1');
  const [pointsAmount, setPointsAmount] = useState<number>(100);
  const [reasonTitle, setReasonTitle] = useState<string>('Excellence in Science Olympiad');

  const studentProfile =
    state.gamificationProfiles.find((p) => p.studentId === selectedStudentId) ||
    state.gamificationProfiles[0];

  // Calculate House Standings
  const houseTotals = {
    'Red Phoenix': 0,
    'Blue Dragons': 0,
    'Green Falcons': 0,
    'Gold Eagles': 0,
  };

  state.gamificationProfiles.forEach((p) => {
    if (houseTotals[p.house] !== undefined) {
      houseTotals[p.house] += p.totalPoints;
    }
  });

  const sortedHouses = Object.entries(houseTotals).sort((a, b) => b[1] - a[1]);

  const handleAwardPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = state.gamificationProfiles.find((p) => p.studentId === targetStudentId);
    awardPoints(targetStudentId, pointsAmount, reasonTitle);

    showToast(
      'Points Officially Awarded!',
      `+${pointsAmount} points granted to ${student?.studentName || 'Student'} for: "${reasonTitle}".`,
      'success'
    );
    setIsAwardModalOpen(false);
  };

  const handleRedeemReward = (reward: RewardItem) => {
    if (studentProfile.totalPoints < reward.pointsCost) {
      showToast(
        'Insufficient Points',
        `You need ${reward.pointsCost} points for ${reward.name}. You currently have ${studentProfile.totalPoints}.`,
        'error'
      );
      return;
    }

    awardPoints(studentProfile.studentId, -reward.pointsCost, `Redeemed: ${reward.name}`);
    showToast(
      'Reward Redeemed Successfully!',
      `Voucher issued for ${reward.name}. Show pass at Student Affairs desk.`,
      'success'
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              House Championship & Gamification
              <span className="text-xs px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold rounded-full border border-amber-200 dark:border-amber-900">
                School Spirit v2.0
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Inter-house trophy leaderboard, badges of honor, daily attendance streaks, and virtual reward store.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAwardModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Award Merits / House Points
          </button>
        </div>
      </div>

      {/* 4 Houses Championship Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedHouses.map(([houseName, points], index) => {
          const isFirst = index === 0;
          return (
            <div
              key={houseName}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-white dark:bg-slate-900 shadow-sm ${
                isFirst
                  ? 'border-amber-400 dark:border-amber-500/70 bg-gradient-to-b from-amber-50/40 dark:from-amber-950/20 to-transparent'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {isFirst && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Shield Leaders
                </div>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm ${
                    houseName === 'Red Phoenix'
                      ? 'bg-rose-500 text-white'
                      : houseName === 'Blue Dragons'
                      ? 'bg-blue-600 text-white'
                      : houseName === 'Green Falcons'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {houseName.charAt(0)}
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-semibold">Rank #{index + 1}</div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {houseName}
                  </h3>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Cumulative House Score</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                  {points.toLocaleString()} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Selector Switcher */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inspect Student:</span>
        <div className="flex flex-wrap gap-2">
          {state.gamificationProfiles.map((p) => (
            <button
              key={p.studentId}
              onClick={() => setSelectedStudentId(p.studentId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStudentId === p.studentId
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {p.studentName} ({p.house})
            </button>
          ))}
        </div>
      </div>

      {/* Student Gamification Showcase Card */}
      {studentProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Student Stat Card (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/20">
                  {studentProfile.house}
                </span>
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm bg-black/20 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                  {studentProfile.currentStreakDays} Days Streak!
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-bold">{studentProfile.studentName}</h2>
                <p className="text-indigo-200 text-xs mt-0.5">{studentProfile.classSection}</p>
              </div>

              {/* Level XP Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Level {studentProfile.level} Scholar</span>
                  <span className="font-mono">{studentProfile.totalPoints} Total XP</span>
                </div>
                <div className="h-2.5 w-full bg-black/30 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (studentProfile.totalPoints % 350) / 3.5)}%` }}
                  />
                </div>
                <div className="text-[11px] text-indigo-300 text-right">
                  {350 - (studentProfile.totalPoints % 350)} XP to Level {studentProfile.level + 1}
                </div>
              </div>
            </div>

            {/* Recent Merit Feed */}
            <div className="pt-4 border-t border-white/20 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-300" /> Recent Merit Activities
              </div>
              <div className="space-y-1.5">
                {studentProfile.recentActivities.slice(0, 3).map((act, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs bg-white/10 p-2 rounded-xl backdrop-blur-sm"
                  >
                    <span className="truncate pr-2">{act.title}</span>
                    <span className="font-mono font-bold text-emerald-300 shrink-0">
                      +{act.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Badges Showcase & Reward Store (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Badges Earned */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Unlocked Badges of Distinction ({studentProfile.badges.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {studentProfile.badges.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span className="text-[10px] font-mono font-bold text-slate-400">+{b.pointsValue} XP</span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white mt-2">
                        {b.name}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {b.description}
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      Earned {b.earnedDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Virtual Reward Store */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  Student Privilege Store (Redeem XP)
                </h3>
                <span className="text-xs text-slate-500">Available: <strong>{studentProfile.totalPoints} XP</strong></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REWARD_STORE.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs">
                          {item.pointsCost} XP
                        </span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white mt-2">
                        {item.name}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                    </div>

                    <button
                      onClick={() => handleRedeemReward(item)}
                      className="mt-3 w-full py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
                    >
                      Redeem Privilege
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Award Points Modal */}
      {isAwardModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAwardModalOpen(false)}
          title="Award Merit Points to Student"
          size="md"
        >
          <form onSubmit={handleAwardPointsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Student Recipient
              </label>
              <select
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              >
                {state.gamificationProfiles.map((p) => (
                  <option key={p.studentId} value={p.studentId}>
                    {p.studentName} ({p.house} - {p.classSection})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Points to Credit (XP)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                step="10"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(+e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason / Academic or Discipline Merit Title
              </label>
              <input
                type="text"
                required
                value={reasonTitle}
                onChange={(e) => setReasonTitle(e.target.value)}
                placeholder="e.g. 100% Score in Algebra Quiz or Clean Campus Drive"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAwardModalOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow"
              >
                Award Points Instantly
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default GamificationModule;
