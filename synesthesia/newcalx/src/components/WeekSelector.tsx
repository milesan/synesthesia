import React from 'react';
import { isSameWeek } from 'date-fns';
import { WeekBox } from './WeekBox';

interface Props {
  weeks: Date[];
  selectedWeeks: Date[];
  squigglePaths: string[];
  onToggleWeek: (week: Date) => void;
  isConsecutiveWeek: (week: Date | undefined) => boolean;
  isFirstOrLastSelected: (week: Date) => boolean;
}

export function WeekSelector({
  weeks,
  selectedWeeks,
  squigglePaths,
  onToggleWeek,
  isConsecutiveWeek,
  isFirstOrLastSelected
}: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
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
            sinePath={squigglePaths[index % squigglePaths.length]}
            onClick={() => onToggleWeek(week)}
          />
        );
      })}
    </div>
  );
}