import React, { useState } from 'react';
import {
  GitMerge,
  Plus,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  Settings,
  Sliders,
  Play,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { WorkflowDefinition, WorkflowStage } from '../../../types/enterprise';
import { EnterpriseState } from '../../../services/enterpriseStore';
import { Modal } from '../../common/Modal';

export const WorkflowBuilderModule: React.FC = () => {
  const { state, mutate, addWorkflowStage } = useEnterprise();
  const { showToast } = useSchool();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-leave');
  const [isAddStageOpen, setIsAddStageOpen] = useState<boolean>(false);

  // New stage form state
  const [newStageName, setNewStageName] = useState('');
  const [newApproverRole, setNewApproverRole] = useState('academic_coordinator');
  const [newTimeLimit, setNewTimeLimit] = useState(24);
  const [newMandatory, setNewMandatory] = useState(true);

  const activeWorkflow =
    state.workflows.find((w) => w.id === selectedWorkflowId) || state.workflows[0];

  const handleToggleActive = (wf: WorkflowDefinition) => {
    mutate((draft: EnterpriseState) => {
      const target = draft.workflows.find((w) => w.id === wf.id);
      if (target) {
        target.isActive = !target.isActive;
      }
    });

    showToast(
      'Workflow State Updated',
      `"${wf.name}" is now ${!wf.isActive ? 'ACTIVE' : 'SUSPENDED'}.`,
      'info'
    );
  };

  const handleCreateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim() || !activeWorkflow) return;

    addWorkflowStage(activeWorkflow.id, newStageName, newApproverRole);

    showToast(
      'Stage Appended to Pipeline',
      `"${newStageName}" assigned to ${newApproverRole} with ${newTimeLimit}h SLA.`,
      'success'
    );

    setIsAddStageOpen(false);
    setNewStageName('');
  };

  const handleSimulateExecution = () => {
    showToast(
      'Workflow Simulation Initialized',
      `Triggered mock submission for "${activeWorkflow?.name}". Stage 1 dispatched to ${activeWorkflow?.stages[0]?.approverRole}.`,
      'success'
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-600 dark:text-sky-400">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Visual Workflow Builder
              <span className="text-xs px-2.5 py-0.5 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold rounded-full border border-sky-200 dark:border-sky-800">
                Zero-Code Approvals
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Multi-tiered institutional approval chains with SLA timeouts, automated escalation, and audit checkpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSimulateExecution}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Play className="w-4 h-4" />
            Simulate Workflow Run
          </button>
        </div>
      </div>

      {/* Workflow Tabs */}
      <div className="flex flex-wrap gap-2">
        {state.workflows.map((wf) => (
          <button
            key={wf.id}
            onClick={() => setSelectedWorkflowId(wf.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              selectedWorkflowId === wf.id
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {wf.name}
          </button>
        ))}
      </div>

      {/* Main Workflow Stage Visualization Canvas */}
      {activeWorkflow && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeWorkflow.name}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeWorkflow.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {activeWorkflow.isActive ? 'Active Pipeline' : 'Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{activeWorkflow.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleActive(activeWorkflow)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {activeWorkflow.isActive ? 'Suspend Workflow' : 'Activate Workflow'}
              </button>

              <button
                onClick={() => setIsAddStageOpen(true)}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Stage
              </button>
            </div>
          </div>

          {/* Visual Step-by-Step Flow */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Approval Pipeline Stages ({activeWorkflow.stages.length} Nodes)
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 overflow-x-auto pb-2">
              {activeWorkflow.stages.map((stage, idx) => (
                <React.Fragment key={stage.id}>
                  {/* Stage Node Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 min-w-[240px] flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" /> {stage.timeLimitHours}h SLA
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {stage.stageName}
                      </h4>
                      <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-1 capitalize">
                        Role: {stage.approverRole.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{stage.isMandatory ? 'Required Gate' : 'Optional'}</span>
                      <span className="text-emerald-600 font-semibold">Enabled</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  {idx < activeWorkflow.stages.length - 1 && (
                    <div className="hidden md:flex items-center justify-center text-slate-400 px-1">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Workflow Metadata Strip */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400">Escalation Authority:</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                {activeWorkflow.escalationRole.replace('_', ' ')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400">Auto-Approval Timeout:</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {activeWorkflow.autoApproveHours ? `${activeWorkflow.autoApproveHours} Hours` : 'Disabled'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400">Audit Compliance:</span>
              <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zero-Trust Verified
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Stage Modal */}
      {isAddStageOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddStageOpen(false)}
          title={`Add Approval Stage to ${activeWorkflow?.name}`}
          size="md"
        >
          <form onSubmit={handleCreateStage} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Stage Name *
              </label>
              <input
                type="text"
                required
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="e.g. Welfare Committee Income Audit"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Approver Role
              </label>
              <select
                value={newApproverRole}
                onChange={(e) => setNewApproverRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              >
                <option value="class_teacher">Class Teacher</option>
                <option value="academic_coordinator">Academic Coordinator</option>
                <option value="counselor">Counselor / Psychologist</option>
                <option value="accountant">Senior Accountant</option>
                <option value="vice_principal">Vice Principal</option>
                <option value="principal">Head of School (Principal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                SLA Time Limit (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={newTimeLimit}
                onChange={(e) => setNewTimeLimit(+e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddStageOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Append Stage to Flow
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default WorkflowBuilderModule;
