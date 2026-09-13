import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PermissionGate } from '../common/PermissionGate';
import { DashboardRouter } from '../dashboard/DashboardRouter';
import { StudentsModule } from './students/StudentsModule';
import { AttendanceModule } from './attendance/AttendanceModule';
import { FeesModule } from './fees/FeesModule';
import { ExamsModule } from './exams/ExamsModule';
import { ReportCardsModule } from './reportCards/ReportCardsModule';
import { TransportModule } from './transport/TransportModule';
import { LibraryModule } from './library/LibraryModule';
import { InventoryModule } from './inventory/InventoryModule';
import { PayrollModule } from './payroll/PayrollModule';
import { CommunicationModule } from './communication/CommunicationModule';
import { CalendarModule } from './calendar/CalendarModule';
import { TimetableModule } from './timetable/TimetableModule';
import { HomeworkModule } from './homework/HomeworkModule';
import { LeaveModule } from './leave/LeaveModule';
import { ClassesSubjectsModule } from './academics/ClassesSubjectsModule';
import { StaffModule } from './staff/StaffModule';
import { ReportsAnalyticsModule } from './reports/ReportsAnalyticsModule';
import { PermissionCenterModule } from './permissions/PermissionCenterModule';
import { DeviceManagementModule } from './devices/DeviceManagementModule';
import { AuditLogsModule } from './audit/AuditLogsModule';
import { SchoolConfigModule } from './settings/SchoolConfigModule';
import { AdmissionsModule } from './admissions/AdmissionsModule';
import { ParentsModule } from './parents/ParentsModule';
import { DocumentsModule } from './documents/DocumentsModule';
import { AcademicYearModule } from './academicYear/AcademicYearModule';
import { BackupRecoveryModule } from './backup/BackupRecoveryModule';
import { BulkOperationsModule } from './bulk/BulkOperationsModule';
import { DigitalTwinModule } from './twin/DigitalTwinModule';
import { StudentRiskModule } from './risk/StudentRiskModule';
import { ParentEngagementModule } from './parents/ParentEngagementModule';
import { GrowthTimelineModule } from './students/GrowthTimelineModule';
import { CareerGuidanceModule } from './guidance/CareerGuidanceModule';
import { FaceAttendanceModule } from './attendance/FaceAttendanceModule';
import { GamificationModule } from './gamification/GamificationModule';
import { AiWorksheetGeneratorModule } from './homework/AiWorksheetGeneratorModule';
import { ExecutiveCommandModule } from './executive/ExecutiveCommandModule';
import { WorkflowBuilderModule } from './workflows/WorkflowBuilderModule';
import { AutomationEngineModule } from './automation/AutomationEngineModule';
import { KpiAnalyticsModule } from './analytics/KpiAnalyticsModule';
import { TenantManagementModule } from './saas/TenantManagementModule';

export const ModuleRouter: React.FC = () => {
  const { activeModule } = useSchool();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardRouter />;

      case 'admissions':
        return (
          <PermissionGate module="admissions" action="view" showFullDeniedPage>
            <AdmissionsModule />
          </PermissionGate>
        );

      case 'students':
        return (
          <PermissionGate module="students" action="view" showFullDeniedPage>
            <StudentsModule />
          </PermissionGate>
        );

      case 'parents':
        return (
          <PermissionGate module="parents" action="view" showFullDeniedPage>
            <ParentsModule />
          </PermissionGate>
        );

      case 'attendance':
        return (
          <PermissionGate module="attendance" action="view" showFullDeniedPage>
            <AttendanceModule />
          </PermissionGate>
        );

      case 'fees':
      case 'payments':
      case 'receipts':
        return (
          <PermissionGate module="fees" action="view" showFullDeniedPage>
            <FeesModule />
          </PermissionGate>
        );

      case 'examinations':
      case 'marks':
      case 'grades':
        return (
          <PermissionGate module="examinations" action="view" showFullDeniedPage>
            <ExamsModule />
          </PermissionGate>
        );

      case 'report_cards':
        return (
          <PermissionGate module="report_cards" action="view" showFullDeniedPage>
            <ReportCardsModule />
          </PermissionGate>
        );

      case 'transport':
        return (
          <PermissionGate module="transport" action="view" showFullDeniedPage>
            <TransportModule />
          </PermissionGate>
        );

      case 'library':
        return (
          <PermissionGate module="library" action="view" showFullDeniedPage>
            <LibraryModule />
          </PermissionGate>
        );

      case 'inventory':
        return (
          <PermissionGate module="inventory" action="view" showFullDeniedPage>
            <InventoryModule />
          </PermissionGate>
        );

      case 'payroll':
        return (
          <PermissionGate module="payroll" action="view" showFullDeniedPage>
            <PayrollModule />
          </PermissionGate>
        );

      case 'communication':
      case 'announcements':
        return (
          <PermissionGate module="communication" action="view" showFullDeniedPage>
            <CommunicationModule />
          </PermissionGate>
        );

      case 'calendar':
        return (
          <PermissionGate module="calendar" action="view" showFullDeniedPage>
            <CalendarModule />
          </PermissionGate>
        );

      case 'timetable':
        return (
          <PermissionGate module="timetable" action="view" showFullDeniedPage>
            <TimetableModule />
          </PermissionGate>
        );

      case 'homework':
      case 'assignments':
        return (
          <PermissionGate module="homework" action="view" showFullDeniedPage>
            <HomeworkModule />
          </PermissionGate>
        );

      case 'leave_management':
        return (
          <PermissionGate module="leave_management" action="view" showFullDeniedPage>
            <LeaveModule />
          </PermissionGate>
        );

      case 'classes_sections':
      case 'subjects':
        return (
          <PermissionGate module="classes_sections" action="view" showFullDeniedPage>
            <ClassesSubjectsModule />
          </PermissionGate>
        );

      case 'teachers':
      case 'staff':
        return (
          <PermissionGate module="teachers" action="view" showFullDeniedPage>
            <StaffModule />
          </PermissionGate>
        );

      case 'reports':
      case 'analytics':
        return (
          <PermissionGate module="reports" action="view" showFullDeniedPage>
            <ReportsAnalyticsModule />
          </PermissionGate>
        );

      case 'permission_management':
      case 'role_management':
      case 'user_management':
        return (
          <PermissionGate module="permission_management" action="view" showFullDeniedPage>
            <PermissionCenterModule />
          </PermissionGate>
        );

      case 'device_management':
        return (
          <PermissionGate module="device_management" action="view" showFullDeniedPage>
            <DeviceManagementModule />
          </PermissionGate>
        );

      case 'audit_logs':
        return (
          <PermissionGate module="audit_logs" action="view" showFullDeniedPage>
            <AuditLogsModule />
          </PermissionGate>
        );

      case 'documents':
        return (
          <PermissionGate module="documents" action="view" showFullDeniedPage>
            <DocumentsModule />
          </PermissionGate>
        );

      case 'academic_year':
        return (
          <PermissionGate module="academic_year" action="view" showFullDeniedPage>
            <AcademicYearModule />
          </PermissionGate>
        );

      case 'backup_recovery':
        return (
          <PermissionGate module="backup_recovery" action="view" showFullDeniedPage>
            <BackupRecoveryModule />
          </PermissionGate>
        );

      case 'bulk_operations':
        return (
          <PermissionGate module="bulk_operations" action="view" showFullDeniedPage>
            <BulkOperationsModule />
          </PermissionGate>
        );

      case 'school_configuration':
        return (
          <PermissionGate module="school_configuration" action="view" showFullDeniedPage>
            <SchoolConfigModule />
          </PermissionGate>
        );

      case 'digital_twin':
        return (
          <PermissionGate module="digital_twin" action="view" showFullDeniedPage>
            <DigitalTwinModule />
          </PermissionGate>
        );

      case 'student_risk':
        return (
          <PermissionGate module="student_risk" action="view" showFullDeniedPage>
            <StudentRiskModule />
          </PermissionGate>
        );

      case 'parent_engagement':
        return (
          <PermissionGate module="parent_engagement" action="view" showFullDeniedPage>
            <ParentEngagementModule />
          </PermissionGate>
        );

      case 'growth_timeline':
        return (
          <PermissionGate module="growth_timeline" action="view" showFullDeniedPage>
            <GrowthTimelineModule />
          </PermissionGate>
        );

      case 'career_guidance':
        return (
          <PermissionGate module="career_guidance" action="view" showFullDeniedPage>
            <CareerGuidanceModule />
          </PermissionGate>
        );

      case 'face_attendance':
        return (
          <PermissionGate module="face_attendance" action="view" showFullDeniedPage>
            <FaceAttendanceModule />
          </PermissionGate>
        );

      case 'gamification':
        return (
          <PermissionGate module="gamification" action="view" showFullDeniedPage>
            <GamificationModule />
          </PermissionGate>
        );

      case 'ai_worksheet_generator':
        return (
          <PermissionGate module="ai_worksheet_generator" action="view" showFullDeniedPage>
            <AiWorksheetGeneratorModule />
          </PermissionGate>
        );

      case 'executive_command':
        return (
          <PermissionGate module="executive_command" action="view" showFullDeniedPage>
            <ExecutiveCommandModule />
          </PermissionGate>
        );

      case 'workflow_builder':
        return (
          <PermissionGate module="workflow_builder" action="view" showFullDeniedPage>
            <WorkflowBuilderModule />
          </PermissionGate>
        );

      case 'automation_engine':
        return (
          <PermissionGate module="automation_engine" action="view" showFullDeniedPage>
            <AutomationEngineModule />
          </PermissionGate>
        );

      case 'kpi_analytics':
        return (
          <PermissionGate module="kpi_analytics" action="view" showFullDeniedPage>
            <KpiAnalyticsModule />
          </PermissionGate>
        );

      case 'saas_tenants':
        return (
          <PermissionGate module="saas_tenants" action="view" showFullDeniedPage>
            <TenantManagementModule />
          </PermissionGate>
        );

      case 'ai_assistant':
        return <DashboardRouter />;

      default:
        return <DashboardRouter />;
    }
  };

  return <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{renderModule()}</div>;
};
