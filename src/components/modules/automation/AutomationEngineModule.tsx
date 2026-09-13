import React, { useState } from 'react';
import {
  Zap,
  Play,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  MessageSquare,
  ShieldAlert,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { AutomationRule } from '../../../types/enterprise';
import { EnterpriseState } from '../../../services/enterpriseStore';
import { Modal } from '../../common/Modal';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const AutomationEngineModule: React.FC = () => {
  const { state, toggleAutomationRule, executeAutomationRule, mutate } = useEnterprise();
  const { showToast } = useSchool();

  const [isAddRuleOpen, setIsAddRuleOpen] = useState<boolean>(false);

  // New rule form
  const [name, setName] = useState('');
  const [triggerEvent, setTriggerEvent] = useState<AutomationRule['triggerEvent']>('attendance_below_threshold');
  const [conditionField, setConditionField] = useState('attendanceRate');
  const [operator, setOperator] = useState<AutomationRule['operator']>('less_than');
  const [conditionValue, setConditionValue] = useState<number>(75);
  const [actionType, setActionType] = useState<AutomationRule['actionType']>('send_parent_whatsapp');
  const [messageTemplate, setMessageTemplate] = useState(
    'Notice: Your ward {student_name} has attendance at {attendance_rate}%. Please coordinate with school.'
  );

  const handleToggle = (rule: AutomationRule) => {
    toggleAutomationRule(rule.id);
    showToast(
      'Rule State Changed',
      `"${rule.name}" is now ${!rule.isEnabled ? 'ENABLED' : 'DISABLED'}.`,
      'info'
    );
  };

  const handleExecuteNow = (rule: AutomationRule) => {
    executeAutomationRule(rule.id);
    showToast(
      'Automation Trigger Dispatched!',
      `Evaluated "${rule.name}". Dispatched ${rule.actionType} to matching records. Counter: ${rule.executionCount + 1}.`,
      'success'
    );
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name,
      triggerEvent,
      conditionField,
      operator,
      conditionValue,
      actionType,
      messageTemplate,
      isEnabled: true,
      executionCount: 0,
      lastExecutedAt: 'Never',
    };

    mutate((draft: EnterpriseState) => {
      draft.automationRules.unshift(newRule);
    });

    showToast('Automation Rule Created', `"${name}" active and listening for trigger events.`, 'success');
    setIsAddRuleOpen(false);
    setName('');
  };

  const totalExecutions = state.automationRules.reduce((acc, r) => acc + r.executionCount, 0);
  const activeRulesCount = state.automationRules.filter((r) => r.isEnabled).length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <Card variant="glass" className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/25 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                  Event-Driven Automation Engine
                </h1>
                <Badge variant="warning" dot size="sm">
                  IF-THEN Rules
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Autonomous triggers that automatically alert parents, flag principals, or schedule interventions based on live school events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25"
              onClick={() => setIsAddRuleOpen(true)}
            >
              Create Automation Rule
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card variant="glass" className="p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-1 ring-amber-500/20 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Active Rules</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
              {activeRulesCount} / {state.automationRules.length}
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Total Actions Dispatched</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
              {totalExecutions.toLocaleString()}
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/20 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Processing Latency</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
              &lt; 300ms
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center ring-1 ring-rose-500/20 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Auto-Intercepted Risks</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
              56
            </div>
          </div>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {state.automationRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-sm ${
              rule.isEnabled
                ? 'border-slate-200 dark:border-slate-800'
                : 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl ${
                    rule.isEnabled
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {rule.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        rule.isEnabled
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}
                    >
                      {rule.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                      IF [{rule.triggerEvent}]
                    </span>
                    <span className="text-slate-400 font-bold">&</span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">
                      WHERE {rule.conditionField} {rule.operator} {rule.conditionValue}
                    </span>
                    <span className="text-slate-400 font-bold">➔</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
                      THEN {rule.actionType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExecuteNow(rule)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                >
                  <Play className="w-3.5 h-3.5" /> Test Run
                </button>

                <button
                  onClick={() => handleToggle(rule)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    rule.isEnabled
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {rule.isEnabled ? 'Deactivate' : 'Enable'}
                </button>
              </div>
            </div>

            {/* Template & Metadata */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div className="truncate max-w-2xl font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                Template: {rule.messageTemplate}
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <span>Total Fired: <strong>{rule.executionCount} times</strong></span>
                <span>Last Fired: <strong>{rule.lastExecutedAt || 'Never'}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Automation Rule Modal */}
      {isAddRuleOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddRuleOpen(false)}
          title="Construct Event-Driven Automation Rule"
          size="md"
        >
          <form onSubmit={handleCreateRule} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Rule Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Consecutive Absence Urgent Notice"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trigger Event
                </label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  <option value="attendance_below_threshold">Attendance Dips Below Norm</option>
                  <option value="fee_overdue">Fee Payment Overdue</option>
                  <option value="marks_failing">Exam Marks Failing</option>
                  <option value="consecutive_absent">Consecutive Days Absent</option>
                  <option value="disciplinary_logged">Disciplinary Incident Logged</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Action to Dispatch
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  <option value="send_parent_whatsapp">Send Parent WhatsApp</option>
                  <option value="send_parent_sms">Send Priority SMS</option>
                  <option value="alert_counselor">Schedule Counselor Alert</option>
                  <option value="flag_principal">Flag to Head of School</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Condition Field
                </label>
                <input
                  type="text"
                  value={conditionField}
                  onChange={(e) => setConditionField(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Operator
                </label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                >
                  <option value="less_than">&lt; (Less Than)</option>
                  <option value="greater_than">&gt; (Greater Than)</option>
                  <option value="equals">= (Equals)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Threshold Value
                </label>
                <input
                  type="number"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(+e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message Content Template
              </label>
              <textarea
                rows={3}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddRuleOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow"
              >
                Save & Deploy Rule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default AutomationEngineModule;
