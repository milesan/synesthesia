import React from 'react';
import { motion } from 'framer-motion';
import { format, endOfWeek } from 'date-fns';
import clsx from 'clsx';

interface Props {
  week: Date;
  index: number;
  isSelected: boolean;
  isConsecutive: boolean;
  isEdge: boolean;
  isFirstSelected?: boolean;
  sinePath: string;
  onClick: () => void;
}

export function WeekBox({
  week,
  index,
  isSelected,
  isConsecutive,
  isEdge,
  isFirstSelected,
  sinePath,
  onClick
}: Props) {
  const weekStart = week;
  const weekEnd = endOfWeek(week);

  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        'week-box relative',
        isSelected && 'selected',
        !isSelected && isConsecutive && 'border-emerald-600/20'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-center flex flex-col justify-center h-full">
        {isSelected ? (
          isEdge ? (
            <>
              <div className="week-date">
                {format(isFirstSelected ? weekStart : weekEnd, 'MMM d')}
              </div>
              <div className="week-label">
                {isFirstSelected ? 'Arrival' : 'Departure'}
              </div>
              <div className="week-label">
                {isFirstSelected ? 'Tuesday' : 'Monday'}
              </div>
            </>
          ) : null
        ) : (
          <>
            <div className="week-label">
              {format(weekStart, 'MMM d')} → {format(weekEnd, 'MMM d')}
            </div>
            <div className="week-label">
              Tue → Mon
            </div>
          </>
        )}
      </div>

      {isSelected && !isEdge && (
        <>
          <div className="connecting-line left" />
          <div className="connecting-line right" />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: 'translate(0, 0)' }}
          >
            <path
              d={sinePath}
              className="squiggle-path"
              stroke="rgb(5, 150, 105)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </>
      )}

      <div 
        className={clsx(
          'absolute bottom-0 left-0 right-0 h-1 transition-all duration-300',
          isSelected ? 'bg-emerald-600/40' : 'bg-stone-200/40'
        )}
      />
    </motion.button>
  );
}