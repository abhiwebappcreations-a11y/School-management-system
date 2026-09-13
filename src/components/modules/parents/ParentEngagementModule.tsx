import React, { useState } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  MessageSquare,
  PhoneCall,
  Calendar,
  CreditCard,
  Smartphone,
  Search,
  Filter,
  Send,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { ParentEngagementMetric } from '../../../types/enterprise';
import { EnterpriseState } from '../../../services/enterpriseStore';
import { Modal } from '../../common/Modal';

export const ParentEngagementModule: React.FC = () => {
  const { state, mutate } = useEnterprise();
  const { showToast } = useSchool();

  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedParent, setSelectedParent] = useState<ParentEngagementMetric | null>(null);

  // Quick message modal state
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [messageText, setMessageText] = useState<string>('');

  const filteredMetrics = state.parentMetrics.filter((m) => {
    const matchesTier = selectedTier === 'all' || m.tier === selectedTier;
    const matchesSearch =
      m.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.classSection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);
    return matchesTier && matchesSearch;
  });

  const avgCompositeScore = Math.round(
    state.parentMetrics.reduce((acc, m) => acc + m.compositeScore, 0) / (state.parentMetrics.length || 1)
  );
  const championsCount = state.parentMetrics.filter((m) => m.tier === 'Champion').length;
  const activeCount = state.parentMetrics.filter((m) => m.tier === 'Active').length;
  const disengagedCount = state.parentMetrics.filter((m) => m.tier === 'Disengaged').length;

  const handleOpenMessageModal = (parent: ParentEngagementMetric) => {
    setSelectedParent(parent);
    if (parent.tier === 'Disengaged') {
      setMessageText(
        `Dear ${parent.parentName}, Dr. Rajesh Sharma and the academic council invite you to an exclusive Parent-Teacher consultation for ${parent.studentName} this Friday.`
      );
    } else {
      setMessageText(
        `Dear ${parent.parentName}, thank you for your outstanding engagement with SmartSchool OS for ${parent.studentName}. View latest Term 2 achievements in the portal.`
      );
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParent) return;

    mutate((draft: EnterpriseState) => {
      const p = draft.parentMetrics.find((m) => m.parentId === selectedParent.parentId);
      if (p) {
        p.messageResponseRate = Math.min(100, p.messageResponseRate + 5);
        p.compositeScore = Math.min(100, p.compositeScore + 2);
      }
    });

    showToast(
      `${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} Dispatched`,
      `Message delivered directly to ${selectedParent.parentName} (${selectedParent.phone}).`,
      'success'
    );
    setSelectedParent(null);
  };

  const handleBulkDisengagedAlert = () => {
    mutate((draft: EnterpriseState) => {
      draft.parentMetrics.forEach((m) => {
        if (m.tier === 'Disengaged') {
          m.compositeScore = Math.min(100, m.compositeScore + 3);
        }
      });
    });

    showToast(
      'Bulk Re-Engagement Campaign Launched',
      `Sent automated interactive WhatsApp check-ins to ${disengagedCount} disengaged guardians.`,
      'info'
    );
  };

  const getTierBadge = (tier: ParentEngagementMetric['tier']) => {
    switch (tier) {
      case 'Champion':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Champion
          </span>
        );
      case 'Active':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Active
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            Moderate
          </span>
        );
      case 'Disengaged':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Disengaged
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Parent Engagement Scorecard
              <span className="text-xs px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold rounded-full border border-purple-200 dark:border-purple-900">
                Composite 360°
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Measure PTM attendance, mobile app touchpoints, fee punctuality & circular responses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBulkDisengagedAlert}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            Broadcast to Disengaged Parents ({disengagedCount})
          </button>
        </div>
      </div>

      {/* Aggregate Score Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Avg Engagement Score</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {avgCompositeScore} / 100
            </div>
          </div>
        </div>

        <div
          onClick={() => setSelectedTier('Champion')}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-purple-300"
        >
          <div className="text-xs text-purple-600 font-semibold">Champions (85-100)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{championsCount} Parents</div>
          <div className="text-[11px] text-slate-500">Highest collaboration tier</div>
        </div>

        <div
          onClick={() => setSelectedTier('Active')}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-300"
        >
          <div className="text-xs text-emerald-600 font-semibold">Active (70-84)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{activeCount} Parents</div>
          <div className="text-[11px] text-slate-500">Consistently engaged</div>
        </div>

        <div
          onClick={() => setSelectedTier('Disengaged')}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-rose-300"
        >
          <div className="text-xs text-rose-600 font-semibold">Disengaged (&lt;50)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{disengagedCount} Parents</div>
          <div className="text-[11px] text-slate-500">Requires targeted outreach</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search parent name, student, phone number or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Tier:
          </span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="Champion">Champion (85+)</option>
            <option value="Active">Active (70-84)</option>
            <option value="Moderate">Moderate (50-69)</option>
            <option value="Disengaged">Disengaged (&lt;50)</option>
          </select>
        </div>
      </div>

      {/* Parent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((parent) => (
          <div
            key={parent.parentId}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {parent.parentName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Child: <strong className="text-slate-700 dark:text-slate-300">{parent.studentName}</strong> ({parent.classSection})
                  </div>
                </div>
                <div>{getTierBadge(parent.tier)}</div>
              </div>

              {/* Composite Score Circle & Bar */}
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Engagement Index</span>
                  <span className="font-bold text-base text-purple-600 dark:text-purple-400">
                    {parent.compositeScore} / 100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      parent.compositeScore >= 85
                        ? 'bg-purple-600'
                        : parent.compositeScore >= 70
                        ? 'bg-emerald-500'
                        : parent.compositeScore >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${parent.compositeScore}%` }}
                  />
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" /> PTM Turnout
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {parent.ptmAttendanceRate}%
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-emerald-500" /> App Active
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {parent.appLoginDaysCount} days / mo
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-amber-500" /> Fee Promptness
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {parent.feePaymentOnTimeRate}%
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-purple-500" /> Response Rate
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {parent.messageResponseRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Active {parent.lastActive}</span>

              <button
                onClick={() => handleOpenMessageModal(parent)}
                className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-200 dark:border-purple-800"
              >
                <Send className="w-3.5 h-3.5" />
                Quick Outreach
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Outreach Modal */}
      {selectedParent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedParent(null)}
          title={`Direct Parent Outreach: ${selectedParent.parentName}`}
          size="md"
        >
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedParent.studentName} ({selectedParent.classSection})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{selectedParent.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Engagement Tier:</span>
                <span>{getTierBadge(selectedParent.tier)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dispatch Channel
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  WhatsApp Official API
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    channel === 'sms'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Priority SMS Gateway
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message Content
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedParent(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Send Message
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default ParentEngagementModule;
