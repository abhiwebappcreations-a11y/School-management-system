import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DeviceType, ModuleName, ActionType, DataScope, DeviceSession } from '../types/auth';
import { dbService } from '../services/database';
import { globalPermissionEngine } from '../services/permissionEngine';

export type DeviceMode = 'auto' | 'desktop' | 'mobile';

interface AuthContextType {
  currentUser: User;
  activeRole: string;
  deviceMode: DeviceMode;
  effectiveDevice: DeviceType;
  setDeviceMode: (mode: DeviceMode) => void;
  switchUser: (userId: string) => void;
  switchRole: (role: string) => void;
  loginDemo: (role: 'principal' | 'teacher' | 'accountant' | 'librarian' | 'driver' | 'parent' | 'student') => void;
  sessions: DeviceSession[];
  revokeSession: (sessionId: string) => void;
  canAccess: (module: ModuleName, action?: ActionType, scope?: DataScope) => boolean;
  getAccessReason: (module: ModuleName, action?: ActionType, scope?: DataScope) => { allowed: boolean; reason?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = dbService.getState();
  const [currentUser, setCurrentUser] = useState<User>(db.users[0]); // Defaults to Principal
  const [activeRole, setActiveRole] = useState<string>(db.users[0].role);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('auto');
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [sessions, setSessions] = useState<DeviceSession[]>(db.sessions);

  // Responsive window resize tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute effective device based on mode and window width
  const effectiveDevice: DeviceType =
    deviceMode === 'auto'
      ? windowWidth < 768
        ? 'mobile'
        : 'desktop'
      : deviceMode === 'mobile'
      ? 'mobile'
      : 'desktop';

  const switchUser = (userId: string) => {
    const found = db.users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setActiveRole(found.role);

      dbService.logAudit({
        userId: found.id,
        userName: found.name,
        userRole: found.roleTitle,
        device: effectiveDevice,
        module: 'user_management',
        action: 'edit',
        targetEntity: `User Session ${found.name}`,
        details: `Switched active user profile to ${found.name} (${found.role})`,
        ipAddress: '127.0.0.1',
        status: 'allowed',
      });
    }
  };

  const switchRole = (role: string) => {
    setActiveRole(role);
    setCurrentUser((prev) => ({
      ...prev,
      role: role,
      roleTitle: `${role.replace('_', ' ').toUpperCase()} (Custom Preview)`,
    }));
  };

  const loginDemo = (roleKey: 'principal' | 'teacher' | 'accountant' | 'librarian' | 'driver' | 'parent' | 'student') => {
    const roleMap: Record<string, string> = {
      principal: 'usr-principal',
      teacher: 'usr-teacher',
      accountant: 'usr-accountant',
      librarian: 'usr-librarian',
      driver: 'usr-driver',
      parent: 'usr-parent',
      student: 'usr-student',
    };

    const targetId = roleMap[roleKey];
    if (targetId) {
      switchUser(targetId);
    }
  };

  const revokeSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isRevoked: true } : s))
    );
    dbService.logAudit({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      device: effectiveDevice,
      module: 'device_management',
      action: 'delete',
      targetEntity: `Device Session ${sessionId}`,
      details: `Administrator revoked active device session ${sessionId}`,
      ipAddress: '127.0.0.1',
      status: 'allowed',
    });
  };

  const canAccess = (module: ModuleName, action: ActionType = 'view', scope?: DataScope): boolean => {
    const res = globalPermissionEngine.evaluate(currentUser, effectiveDevice, module, action, scope);
    return res.allowed;
  };

  const getAccessReason = (module: ModuleName, action: ActionType = 'view', scope?: DataScope) => {
    return globalPermissionEngine.evaluate(currentUser, effectiveDevice, module, action, scope);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        deviceMode,
        effectiveDevice,
        setDeviceMode,
        switchUser,
        switchRole,
        loginDemo,
        sessions,
        revokeSession,
        canAccess,
        getAccessReason,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
