import React from 'react';
import { isSameWeek } from 'date-fns';
import { WeekBox } from './WeekBox';
import clsx from 'clsx';

interface Props {
  weeks: Date[];
  selectedWeeks: Date[];
  onToggleWeek: (week: Date) => void;
  isConsecutiveWeek: (week: Date | undefined) => boolean;
  isFirstOrLastSelected: (week: Date) => boolean;
}

export function WeekSelector({
  weeks,
  selectedWeeks,
  onToggleWeek,
  isConsecutiveWeek,
  isFirstOrLastSelected
}: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-6">
      {weeks.map((week, index) => {
        const isSelected = selectedWeeks.some(w => isSameWeek(w, week));
        const isFirstSelected = selectedWeeks.length > 0 && isSameWeek(week, selectedWeeks[0]);
        
        return (
          <WeekBox
            key={week.toISOString()}
            week={week}
            index={index}
            isSelected={isSelected}
            isConsecutive={isConsecutiveWeek(week)}
            isEdge={isFirstOrLastSelected(week)}
            isFirstSelected={isFirstSelected}
            onClick={() => onToggleWeek(week)}
          />
        );
      })}
    </div>
  );
}