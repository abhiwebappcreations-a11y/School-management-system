import React, { useState } from 'react';
import { Library, Search, Plus, BookOpen, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const LibraryModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { canAccess } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(db.books[0]?.id || '');
  const [borrowerName, setBorrowerName] = useState('Ravi Kumar (8A)');

  const filteredBooks = db.books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueBook = () => {
    const book = db.books.find((b) => b.id === selectedBookId);
    if (!book || book.availableCopies <= 0) {
      showToast('Unavailable', 'No copies currently available on shelf', 'warning');
      return;
    }

    mutateDb((draft) => {
      const b = draft.books.find((x) => x.id === selectedBookId);
      if (b) b.availableCopies -= 1;

      draft.bookTransactions.unshift({
        id: `bt-${Date.now()}`,
        bookId: book.id,
        bookTitle: book.title,
        borrowerType: 'student',
        borrowerId: 'std-1',
        borrowerName: borrowerName,
        classSection: 'Class 8A',
        issueDate: new Date().toISOString().substring(0, 10),
        dueDate: '2026-09-28',
        fineAmount: 0,
        status: 'issued',
      });
    });

    setIsIssueModalOpen(false);
    showToast('Book Issued', `"${book.title}" issued to ${borrowerName}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Library className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Library Circulation & Digital Catalogue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Book cataloging, ISBN lookup, borrowing histories, return receipts, and overdue fine management
          </p>
        </div>

        {canAccess('library', 'create') && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsIssueModalOpen(true)}
          >
            Issue Book
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, author, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
          />
        </div>
      </Card>

      {/* Books Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Author</th>
                <th className="py-3 px-4">ISBN</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location / Rack</th>
                <th className="py-3 px-4 text-center">Available / Total</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
              {filteredBooks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{b.title}</span>
                    <span className="text-[10px] text-slate-400">by {b.author} • {b.publisher}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{b.isbn}</td>
                  <td className="py-3 px-4">
                    <Badge variant="primary" size="sm">{b.category}</Badge>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-400">{b.rackLocation}</td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400">{b.availableCopies}</span>
                    <span className="text-slate-400"> / {b.totalCopies}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={b.availableCopies > 0 ? 'success' : 'danger'}>
                      {b.availableCopies > 0 ? 'AVAILABLE' : 'ALL ISSUED'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Issue Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Book to Student or Faculty"
        description="Select book copy and borrower"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleIssueBook}>
              Complete Issue
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Book Title
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            >
              {db.books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.availableCopies} copies available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Borrower Name & Class
            </label>
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
