import React, { useState } from 'react';
import {
  Globe,
  Building,
  CheckCircle2,
  Plus,
  Sliders,
  Shield,
  Palette,
  ExternalLink,
  Users,
  Database,
  Sparkles,
} from 'lucide-react';
import { useEnterprise } from '../../../context/EnterpriseContext';
import { useSchool } from '../../../context/SchoolContext';
import { InstitutionalTenant } from '../../../types/enterprise';
import { EnterpriseState } from '../../../services/enterpriseStore';
import { Modal } from '../../common/Modal';

export const TenantManagementModule: React.FC = () => {
  const { state, mutate } = useEnterprise();
  const { currentTenantId, setCurrentTenantId, showToast } = useSchool();

  const [selectedTenant, setSelectedTenant] = useState<InstitutionalTenant | null>(null);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState<boolean>(false);

  // New tenant form
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [board, setBoard] = useState('CBSE (Central Board of Secondary Education)');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [motto, setMotto] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');

  const handleSwitchTenant = (tenant: InstitutionalTenant) => {
    setCurrentTenantId(tenant.id);
    showToast(
      'Institutional Tenant Switched',
      `Active workspace shifted to "${tenant.name}" (${tenant.subdomain}.smartschoolos.com). Clean data partition engaged.`,
      'success'
    );
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTenant: InstitutionalTenant = {
      id: `tenant-${Date.now()}`,
      name,
      subdomain: subdomain.toLowerCase().replace(/\s+/g, '-'),
      brandCode: `${name.substring(0, 3).toUpperCase()}-04`,
      motto: motto || 'Empowering Future Leaders',
      affiliationNumber: affiliationNumber || 'CBSE/AFF/998877',
      board,
      logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80',
      primaryColorHex: primaryColor,
      accentColorHex: '#06b6d4',
      campusesCount: 1,
      totalStudentsCount: 450,
      isIsolatedData: true,
      contactEmail: `admin@${subdomain}.edu`,
    };

    mutate((draft: EnterpriseState) => {
      draft.tenants.push(newTenant);
    });

    showToast(
      'New Institution Provisioned',
      `Tenant "${name}" successfully provisioned with dedicated database container.`,
      'success'
    );
    setIsAddTenantOpen(false);
    setName('');
    setSubdomain('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Enterprise Multi-Tenant SaaS
              <span className="text-xs px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
                Multi-Institutional
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Manage multiple school branches, educational trusts, subdomains, white-label branding & tenant data isolation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddTenantOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Provision New School Tenant
          </button>
        </div>
      </div>

      {/* Institutional Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {state.tenants.map((tenant) => {
          const isActive = tenant.id === currentTenantId;

          return (
            <div
              key={tenant.id}
              className={`p-6 rounded-3xl border transition-all duration-300 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between ${
                isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tenant.logoUrl}
                      alt={tenant.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {tenant.name}
                      </h3>
                      <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                        {tenant.subdomain}.smartschoolos.com
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>

                <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-3">
                  "{tenant.motto}"
                </p>

                {/* Details Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Board / Affiliation:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[180px]">
                      {tenant.board.split('(')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Affiliation Code:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {tenant.affiliationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campuses & Students:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {tenant.campusesCount} Campus • {tenant.totalStudentsCount.toLocaleString()} Students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Data Architecture:</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Database className="w-3 h-3" /> Fully Isolated
                    </span>
                  </div>
                </div>

                {/* Brand Colors Preview */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5" /> Brand Colors:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: tenant.primaryColorHex }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: tenant.accentColorHex }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Switch CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedTenant(tenant)}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
                >
                  Edit Branding
                </button>

                <button
                  onClick={() => handleSwitchTenant(tenant)}
                  disabled={isActive}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {isActive ? 'Current Tenant' : 'Switch Workspace'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Provision New Tenant Modal */}
      {isAddTenantOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddTenantOpen(false)}
          title="Provision New Institutional Tenant"
          size="md"
        >
          <form onSubmit={handleCreateTenant} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oxford Global Model Academy"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dedicated Subdomain *
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="oxford-academy"
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg text-sm text-slate-900 dark:text-white font-mono"
                />
                <span className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-mono rounded-r-lg border border-l-0 border-slate-200 dark:border-slate-700">
                  .smartschoolos.com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Educational Board
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  <option value="CBSE (Central Board of Secondary Education)">CBSE</option>
                  <option value="CISCE (ICSE / ISC Board)">ICSE / CISCE</option>
                  <option value="Cambridge Assessment (IGCSE / A-Levels)">Cambridge (CIE)</option>
                  <option value="International Baccalaureate (IB)">IB World School</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Affiliation Number
                </label>
                <input
                  type="text"
                  value={affiliationNumber}
                  onChange={(e) => setAffiliationNumber(e.target.value)}
                  placeholder="CBSE/AFF/12345"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Motto
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="e.g. In Pursuit of Excellence and Character"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="font-mono text-xs">{primaryColor}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddTenantOpen(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Provision & Launch
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default TenantManagementModule;
