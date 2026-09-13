import React, { useState } from 'react';
import { Briefcase, Search, Plus, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const StaffModule: React.FC = () => {
  const { db, showToast } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = db.users.filter(
    (u) =>
      u.role !== 'parent' &&
      u.role !== 'student' &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Teachers & Administrative Faculty Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Teaching staff, department heads, administrative officers, and transport executives
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => showToast('Staff Registration', 'Employee onboarding wizard ready', 'info')}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {staff.name}
                  </h3>
                  <Badge variant="primary" size="sm" className="mt-0.5">
                    {staff.role.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {staff.roleTitle}
              </p>

              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{staff.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{staff.branchName.split('(')[0]}</span>
              <Badge variant="success" size="sm">Active Payroll</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
