import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  enterpriseStore,
  EnterpriseState,
  FaceAttendanceEntry,
} from '../services/enterpriseStore';
import {
  RoomOccupancy,
  StudentRiskProfile,
  ParentEngagementMetric,
  StudentGrowthMilestone,
  CareerPathway,
  StudentGamificationProfile,
  GeneratedWorksheet,
  WorkflowDefinition,
  AutomationRule,
  InstitutionalTenant,
} from '../types/enterprise';

interface EnterpriseContextType {
  state: EnterpriseState;
  refresh: () => void;
  mutate: (updater: (draft: EnterpriseState) => void) => void;
  toggleRoomLight: (id: string) => void;
  toggleRoomProjector: (id: string) => void;
  updateRoomStatus: (id: string, status: RoomOccupancy['status']) => void;
  scheduleRiskCounseling: (studentId: string, counselor: string, note: string) => void;
  resolveRisk: (studentId: string) => void;
  addMilestone: (milestone: Omit<StudentGrowthMilestone, 'id'>) => StudentGrowthMilestone;
  awardPoints: (studentId: string, points: number, activityTitle: string) => void;
  addFaceLog: (entry: Omit<FaceAttendanceEntry, 'id' | 'timestamp'>) => FaceAttendanceEntry;
  addWorksheet: (sheet: GeneratedWorksheet) => void;
  toggleAutomationRule: (ruleId: string) => void;
  executeAutomationRule: (ruleId: string) => void;
  addWorkflowStage: (workflowId: string, stageName: string, role: string) => void;
}

const EnterpriseContext = createContext<EnterpriseContextType | undefined>(undefined);

export const EnterpriseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EnterpriseState>(enterpriseStore.getState());

  const refresh = () => {
    setState({ ...enterpriseStore.getState() });
  };

  const mutate = (updater: (draft: EnterpriseState) => void) => {
    enterpriseStore.mutate(updater);
    refresh();
  };

  const toggleRoomLight = (id: string) => {
    enterpriseStore.toggleRoomLight(id);
    refresh();
  };

  const toggleRoomProjector = (id: string) => {
    enterpriseStore.toggleRoomProjector(id);
    refresh();
  };

  const updateRoomStatus = (id: string, status: RoomOccupancy['status']) => {
    enterpriseStore.updateRoomStatus(id, status);
    refresh();
  };

  const scheduleRiskCounseling = (studentId: string, counselor: string, note: string) => {
    enterpriseStore.scheduleRiskCounseling(studentId, counselor, note);
    refresh();
  };

  const resolveRisk = (studentId: string) => {
    enterpriseStore.resolveRisk(studentId);
    refresh();
  };

  const addMilestone = (milestone: Omit<StudentGrowthMilestone, 'id'>) => {
    const res = enterpriseStore.addMilestone(milestone);
    refresh();
    return res;
  };

  const awardPoints = (studentId: string, points: number, activityTitle: string) => {
    enterpriseStore.awardPoints(studentId, points, activityTitle);
    refresh();
  };

  const addFaceLog = (entry: Omit<FaceAttendanceEntry, 'id' | 'timestamp'>) => {
    const res = enterpriseStore.addFaceLog(entry);
    refresh();
    return res;
  };

  const addWorksheet = (sheet: GeneratedWorksheet) => {
    enterpriseStore.addWorksheet(sheet);
    refresh();
  };

  const toggleAutomationRule = (ruleId: string) => {
    enterpriseStore.toggleAutomationRule(ruleId);
    refresh();
  };

  const executeAutomationRule = (ruleId: string) => {
    enterpriseStore.executeAutomationRule(ruleId);
    refresh();
  };

  const addWorkflowStage = (workflowId: string, stageName: string, role: string) => {
    enterpriseStore.addWorkflowStage(workflowId, stageName, role);
    refresh();
  };

  return (
    <EnterpriseContext.Provider
      value={{
        state,
        refresh,
        mutate,
        toggleRoomLight,
        toggleRoomProjector,
        updateRoomStatus,
        scheduleRiskCounseling,
        resolveRisk,
        addMilestone,
        awardPoints,
        addFaceLog,
        addWorksheet,
        toggleAutomationRule,
        executeAutomationRule,
        addWorkflowStage,
      }}
    >
      {children}
    </EnterpriseContext.Provider>
  );
};

export const useEnterprise = (): EnterpriseContextType => {
  const context = useContext(EnterpriseContext);
  if (!context) {
    throw new Error('useEnterprise must be used within an EnterpriseProvider');
  }
  return context;
};
