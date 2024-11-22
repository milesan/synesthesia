import React from 'react';
import { motion } from 'framer-motion';
import { format, endOfWeek } from 'date-fns';
import clsx from 'clsx';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Props {
  week: Date;
  index: number;
  isSelected: boolean;
  isConsecutive: boolean;
  isEdge: boolean;
  isFirstSelected?: boolean;
  onClick: () => void;
}

export function WeekBox({
  week,
  index,
  isSelected,
  isConsecutive,
  isEdge,
  isFirstSelected,
  onClick
}: Props) {
  const weekStart = week;
  const weekEnd = endOfWeek(week);
  const isSmall = useMediaQuery('(max-width: 640px)');

  // Generate a random continuous sine wave that connects at the edges
  const generateSineWave = () => {
    const width = 100;
    const height = 20;
    const points = 200;
    const frequency = 1 + Math.random() * 2;
    const amplitude = (height / 3) * (0.8 + Math.random() * 0.4);
    const phase = Math.random() * Math.PI * 2;

    let path = `M 0 ${height / 2} `;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = height / 2 + Math.sin((x / width) * Math.PI * 2 * frequency + phase) * amplitude;
      path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    }
    path += `L ${width} ${height / 2}`;
    return path;
  };

  const [sinePath] = React.useState(generateSineWave);

  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        'stay2-week-box relative',
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
              <div className={clsx(
                "font-serif",
                isSmall ? "text-base" : "text-xl"
              )}>
                {format(isFirstSelected ? weekStart : weekEnd, 'MMM d')}
              </div>
              <div className={clsx(
                "font-mono text-stone-500",
                isSmall ? "text-xs" : "text-sm"
              )}>
                {isFirstSelected ? 'Arrival' : 'Departure'}
              </div>
            </>
          ) : null
        ) : (
          <>
            <div className="font-serif text-lg opacity-100">
              {format(weekStart, 'MMM d')}
            </div>
            {!isSmall && (
              <div className="font-mono text-stone-500 text-sm opacity-85">
                → {format(weekEnd, 'MMM d')}
              </div>
            )}
          </>
        )}
      </div>

      {/* Sine wave animation for selected non-edge weeks */}
      {isSelected && !isEdge && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 20"
          >
            <path
              d={sinePath}
              className="stay2-squiggle"
              stroke="rgb(5, 150, 105)"
              strokeWidth="2"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}

      {/* Bottom highlight */}
      <div 
        className={clsx(
          'absolute bottom-0 left-0 right-0 h-1 transition-all duration-300',
          isSelected ? 'bg-emerald-600/40' : 'bg-stone-200/40'
        )}
      />
    </motion.button>
  );
}