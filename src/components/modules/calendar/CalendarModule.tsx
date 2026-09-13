import React from 'react';
import { Calendar, Plus, Clock, Users } from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { Card, CardHeader } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

export const CalendarModule: React.FC = () => {
  const { db, showToast } = useSchool();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            School Academic Calendar & Events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holidays, examination windows, parent-teacher conferences, and sports meets
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => showToast('Event Scheduler', 'Event creation modal ready', 'info')}
        >
          Add Event
        </Button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {db.calendarEvents.map((evt) => (
          <Card key={evt.id} className="p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <Badge
                variant={
                  evt.category === 'holiday'
                    ? 'danger'
                    : evt.category === 'exam'
                    ? 'warning'
                    : 'primary'
                }
              >
                {evt.category.toUpperCase()}
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">{evt.startDate}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {evt.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {evt.description}
            </p>

            <div className="mt-4 pt-3 border-t text-[10px] text-slate-400 flex items-center justify-between">
              <span>Audience: {evt.audience.toUpperCase()}</span>
              <span>{evt.isAllDay ? 'All Day Event' : 'Scheduled'}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
