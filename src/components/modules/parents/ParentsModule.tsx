import React, { useState } from 'react';
import { Users, Search, Phone, Mail, GraduationCap, Plus, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { useAuth } from '../../../context/AuthContext';
import { Parent } from '../../../types/student';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';

export const ParentsModule: React.FC = () => {
  const { db, showToast } = useSchool();
  const { canAccess } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  const filteredParents = db.parents.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedParent) return;
    setIsMessageModalOpen(false);
    setMessageText('');
    showToast('Message Dispatched', `Direct communication sent to ${selectedParent.name} via ${selectedParent.communicationPreference}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Parents & Guardian Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified primary guardians, emergency contacts, linked student wards, and communication channels
          </p>
        </div>

        <Badge variant="primary" size="md">
          {db.parents.length} Registered Guardians
        </Badge>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search parent by name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none dark:text-white"
          />
        </div>
      </Card>

      {/* Parents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredParents.map((parent) => {
          const linkedStudents = db.students.filter((s) => parent.linkedStudentIds.includes(s.id));

          return (
            <Card key={parent.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={parent.avatarUrl}
                      alt={parent.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {parent.name}
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        {parent.relationship} • {parent.occupation}
                      </span>
                    </div>
                  </div>

                  <Badge variant="primary" size="sm">
                    {parent.communicationPreference} Preferred
                  </Badge>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{parent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{parent.email}</span>
                  </div>
                </div>

                {/* Linked Wards */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                    Linked Student Wards
                  </span>
                  <div className="space-y-1.5">
                    {linkedStudents.map((std) => (
                      <div
                        key={std.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img src={std.photoUrl} alt={std.name} className="w-6 h-6 rounded-lg object-cover" />
                          <span className="font-bold text-slate-900 dark:text-white">{std.name}</span>
                          <span className="text-[11px] text-slate-400">({std.classSection})</span>
                        </div>
                        <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                          {std.admissionNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Emergency: {parent.emergencyContact}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={MessageSquare}
                  onClick={() => {
                    setSelectedParent(parent);
                    setIsMessageModalOpen(true);
                  }}
                >
                  Send Direct Notice
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Message Modal */}
      {selectedParent && (
        <Modal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          title={`Message Guardian — ${selectedParent.name}`}
          description={`Direct alert dispatched to ${selectedParent.phone} (${selectedParent.communicationPreference})`}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSendMessage}>
                Dispatch Message
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Communication Subject / Template
              </label>
              <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 font-semibold">
                <option>Parent-Teacher Meeting Appointment</option>
                <option>Academic Performance Notification</option>
                <option>Transport / Bus Arrival Update</option>
                <option>Fee Payment Receipt & Acknowledgement</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message Body
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your custom communication..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
