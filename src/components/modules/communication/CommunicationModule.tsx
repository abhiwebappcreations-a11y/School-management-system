import React, { useState } from 'react';
import { Megaphone, Mail, MessageSquare, Send, Plus, CheckCircle2 } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Announcement } from '../../../types/system';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const CommunicationModule: React.FC = () => {
  const { db, mutateDb, showToast } = useSchool();
  const { currentUser, canAccess } = useAuth();

  const [isNewNoticeOpen, setIsNewNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<'low' | 'medium' | 'high'>('high');

  const handleCreateNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const newNotice: Announcement = {
      id: `ann-${Date.now()}`,
      title: noticeTitle,
      content: noticeContent,
      priority: noticePriority,
      targetAudiences: ['all'],
      channels: ['in_app', 'email'],
      authorName: currentUser.name,
      authorRole: currentUser.roleTitle.split('(')[0],
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isPinned: false,
    };

    mutateDb((draft) => {
      draft.announcements.unshift(newNotice);
    });

    setIsNewNoticeOpen(false);
    setNoticeTitle('');
    setNoticeContent('');
    showToast('Circular Broadcasted', 'Notice transmitted to parents, students, and staff portals', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Communication Center & Circulars
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Targeted announcements, SMS alerts, parent newsletters, and emergency broadcasts
          </p>
        </div>

        {canAccess('communication', 'create') && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsNewNoticeOpen(true)}
          >
            New Circular
          </Button>
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {db.announcements.map((ann) => (
          <Card key={ann.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={ann.priority === 'high' ? 'danger' : 'primary'}>
                    {ann.priority.toUpperCase()} PRIORITY
                  </Badge>
                  {ann.isPinned && <Badge variant="warning">PINNED</Badge>}
                  <span className="text-[10px] text-slate-400 font-mono">{ann.publishedAt}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {ann.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Mail className="w-3.5 h-3.5" />
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {ann.content}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Published by <strong>{ann.authorName}</strong> ({ann.authorRole})</span>
              <span>Channels: In-App, Email Notification</span>
            </div>
          </Card>
        ))}
      </div>

      {/* New Notice Modal */}
      <Modal
        isOpen={isNewNoticeOpen}
        onClose={() => setIsNewNoticeOpen(false)}
        title="Broadcast New Circular"
        description="Transmit announcement to school community"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewNoticeOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={Send} onClick={handleCreateNotice}>
              Broadcast Notice
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notice Title
            </label>
            <input
              type="text"
              placeholder="e.g. Science Exhibition Timetable"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={noticePriority}
              onChange={(e) => setNoticePriority(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-bold"
            >
              <option value="high">High (Urgent Red Banner)</option>
              <option value="medium">Medium (Standard Circular)</option>
              <option value="low">Low (Informational)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message Content
            </label>
            <textarea
              rows={4}
              placeholder="Write circular body..."
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
