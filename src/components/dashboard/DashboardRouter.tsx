import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { LibrarianDashboard } from './LibrarianDashboard';
import { DriverDashboard } from './DriverDashboard';
import { ParentDashboard } from './ParentDashboard';
import { StudentDashboard } from './StudentDashboard';

export const DashboardRouter: React.FC = () => {
  const { currentUser } = useAuth();

  switch (currentUser.role) {
    case 'principal':
    case 'super_admin':
    case 'school_admin':
    case 'it_admin':
    case 'vice_principal':
    case 'academic_coordinator':
      return <AdminDashboard />;

    case 'teacher':
    case 'class_teacher':
    case 'subject_teacher':
      return <TeacherDashboard />;

    case 'accountant':
      return <AccountantDashboard />;

    case 'librarian':
      return <LibrarianDashboard />;

    case 'driver':
    case 'bus_attendant':
    case 'transport_manager':
      return <DriverDashboard />;

    case 'parent':
      return <ParentDashboard />;

    case 'student':
      return <StudentDashboard />;

    default:
      return <AdminDashboard />;
  }
};
