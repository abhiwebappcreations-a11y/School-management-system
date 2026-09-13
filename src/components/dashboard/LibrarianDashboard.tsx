import React from 'react';
import { BookOpen, BookCheck, AlertCircle, IndianRupee, Search, Plus, ArrowRight } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const LibrarianDashboard: React.FC = () => {
  const { db, setActiveModule, showToast } = useSchool();

  const totalBooks = db.books.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableBooks = db.books.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedBooks = totalBooks - availableBooks;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-yellow-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="warning" className="bg-amber-500/20 text-amber-200 border-amber-400/30">
                Central Learning Resource Center
              </Badge>
              <span className="text-xs text-amber-200/80">Library & Archives</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Librarian Portal — Sunita Patel
            </h1>
            <p className="text-sm text-amber-100/90 mt-1 max-w-xl leading-relaxed">
              Track active book loans, manage catalogue additions, process barcode check-outs, and monitor overdue fines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30"
              icon={Plus}
              onClick={() => setActiveModule('library')}
            >
              Issue / Return Book
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable onClick={() => setActiveModule('library')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Collection</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalBooks} Copies</div>
            <div className="text-xs text-slate-500 mt-1">{db.books.length} unique titles in catalogue</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('library')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Books Issued</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{issuedBooks} Loans</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{availableBooks} currently on shelf</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('library')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Returns Due This Week</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">4 Due</div>
            <div className="text-xs text-slate-500 mt-1">Automatic reminders enabled</div>
          </div>
        </Card>

        <Card hoverable onClick={() => setActiveModule('library')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fines Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">₹450</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Clear of overdue arrears</div>
          </div>
        </Card>
      </div>

      {/* Books Catalogue & Active Circulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Active Circulation & Borrowers"
            subtitle="Currently checked out titles"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('library')}>
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {db.bookTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tx.bookTitle}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Issued to {tx.borrowerName} ({tx.classSection})
                  </p>
                  <span className="text-[10px] text-slate-400">Due Date: {tx.dueDate}</span>
                </div>
                <Badge variant={tx.status === 'issued' ? 'primary' : 'warning'}>
                  {tx.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Catalogue Highlights"
            subtitle="Inventory across departments"
            action={
              <Button variant="ghost" size="sm" onClick={() => setActiveModule('library')}>
                Catalogue <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          />
          <div className="space-y-3">
            {db.books.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{b.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    by {b.author} • {b.rackLocation}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {b.availableCopies} of {b.totalCopies}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Available</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
