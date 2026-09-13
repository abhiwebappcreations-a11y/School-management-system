import React from 'react';
import { ModuleName, ActionType, DataScope } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { AccessDeniedView } from './AccessDeniedView';

export interface PermissionGateProps {
  module: ModuleName;
  action?: ActionType;
  scope?: DataScope;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFullDeniedPage?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action = 'view',
  scope,
  children,
  fallback = null,
  showFullDeniedPage = false,
}) => {
  const { canAccess, getAccessReason, currentUser, effectiveDevice } = useAuth();
  const allowed = canAccess(module, action, scope);

  if (allowed) {
    return <>{children}</>;
  }

  if (showFullDeniedPage) {
    const { reason } = getAccessReason(module, action, scope);
    return (
      <AccessDeniedView
        module={module}
        action={action}
        user={currentUser}
        device={effectiveDevice}
        reason={reason}
      />
    );
  }

  return <>{fallback}</>;
};
