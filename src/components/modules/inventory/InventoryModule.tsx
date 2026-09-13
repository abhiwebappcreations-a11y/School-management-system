import React from 'react';
import { Package, AlertTriangle, Plus, CheckCircle2, TrendingDown } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const InventoryModule: React.FC = () => {
  const { db, showToast } = useSchool();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            School Assets, Lab Supplies & Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stationery, classroom equipment, laboratory microscopes, sports gear, and low-stock alerts
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => showToast('Stock Item', 'New stock item created', 'success')}
        >
          Add Item
        </Button>
      </div>

      {/* Inventory Items Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Item Code & Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">In Stock</th>
                <th className="py-3.5 px-4">Unit Cost</th>
                <th className="py-3.5 px-4">Storage Location</th>
                <th className="py-3.5 px-4">Vendor Supplier</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {db.inventory.map((item) => {
                const isLow = item.quantityInStock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.code}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary" size="sm">{item.category}</Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-sm">
                      <span className={isLow ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}>
                        {item.quantityInStock} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-slate-500">{item.location}</td>
                    <td className="py-3 px-4 font-semibold">{item.supplierName}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={isLow ? 'warning' : 'success'}>
                        {isLow ? 'REORDER' : 'OPTIMAL'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
