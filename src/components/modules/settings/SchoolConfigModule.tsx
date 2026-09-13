import React, { useState } from 'react';
import { Sliders, Building2, Calendar, Award, Save, RefreshCw } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const SchoolConfigModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();

  const [schoolName, setSchoolName] = useState(db.schoolConfig.schoolName);
  const [board, setBoard] = useState(db.schoolConfig.board);
  const [affiliationNo, setAffiliationNo] = useState(db.schoolConfig.affiliationNumber);
  const [phone, setPhone] = useState(db.schoolConfig.phone);
  const [email, setEmail] = useState(db.schoolConfig.email);
  const [address, setAddress] = useState(db.schoolConfig.address);

  const handleSaveConfig = () => {
    mutateDb((draft) => {
      draft.schoolConfig.schoolName = schoolName;
      draft.schoolConfig.board = board;
      draft.schoolConfig.affiliationNumber = affiliationNo;
      draft.schoolConfig.phone = phone;
      draft.schoolConfig.email = email;
      draft.schoolConfig.address = address;
    });
    showToast('Configuration Saved', 'Institutional identity settings updated', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            School Configuration & Campus Profiles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Board affiliation details, academic years, multi-branch directories, and institutional parameters
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Save}
          onClick={handleSaveConfig}
        >
          Save Settings
        </Button>
      </div>

      {/* Identity Configuration Form */}
      <Card className="p-6 space-y-4">
        <CardHeader
          title="Institutional Identity"
          subtitle="Official school credentials printed on report cards and fee receipts"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">School Name</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Education Board</label>
            <input
              type="text"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Affiliation Number</label>
            <input
              type="text"
              value={affiliationNo}
              onChange={(e) => setAffiliationNo(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Card>

      {/* Multi-Branch Overview */}
      <Card className="p-6">
        <CardHeader
          title="Multi-Branch Campuses"
          subtitle="Campuses registered under the SmartSchool OS license"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {db.branches.map((b) => (
            <div key={b.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{b.name}</span>
                <Badge variant="primary">{b.code}</Badge>
              </div>
              <p className="text-slate-500">{b.address}, {b.city}</p>
              <div className="pt-2 text-[11px] text-slate-400">
                Principal: <strong>{b.principalName}</strong> • Phone: {b.phone}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
