import React, { useState, useMemo } from 'react';
import { Trees, ChevronLeft, ChevronRight } from 'lucide-react';
import { isSameWeek, addWeeks, isAfter, isBefore, addMonths, startOfMonth, format } from 'date-fns';
import { WeekSelector } from '../components/WeekSelector';
import { CabinSelector } from '../components/CabinSelector';
import { BookingSummary } from '../components/BookingSummary';
import { MaxWeeksModal } from '../components/MaxWeeksModal';
import { generateWeeks, generateSquigglePath, getWeeksInRange } from '../utils/dates';
import { useWeeklyAccommodations } from '../hooks/useWeeklyAccommodations';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import './Book2Page.css';

const WEEKS_PER_VIEW = 16;
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2940&auto=format&fit=crop";

export function Book2Page() {
  const { accommodations, loading } = useWeeklyAccommodations();
  const [selectedWeeks, setSelectedWeeks] = useState<Date[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [showMaxWeeksModal, setShowMaxWeeksModal] = useState(false);
  
  const [squigglePaths] = useState(() => 
    Array.from({ length: WEEKS_PER_VIEW }, () => generateSquigglePath())
  );

  const weeks = useMemo(() => 
    generateWeeks(currentMonth, WEEKS_PER_VIEW),
    [currentMonth]
  );

  const isConsecutiveWeek = (nextWeek: Date | undefined) => {
    if (!nextWeek || selectedWeeks.length === 0) return false;
    return selectedWeeks.some(week => 
      isSameWeek(addWeeks(week, 1), nextWeek)
    );
  };

  const isFirstOrLastSelected = (week: Date) => {
    if (selectedWeeks.length === 0) return false;
    return isSameWeek(week, selectedWeeks[0]) || 
           isSameWeek(week, selectedWeeks[selectedWeeks.length - 1]);
  };

  const toggleWeek = async (week: Date) => {
    setSelectedWeeks(prev => {
      const isSelected = prev.some(w => isSameWeek(w, week));
      
      if (isSelected && !isFirstOrLastSelected(week)) {
        return prev;
      }
      
      if (isSelected) {
        return prev.filter(w => !isSameWeek(w, week));
      }
      
      if (prev.length === 0) {
        return [week];
      }

      const earliestDate = prev[0];
      const latestDate = prev[prev.length - 1];

      // Check if adding this week would exceed 12 weeks
      let newWeeks: Date[];
      if (isBefore(week, earliestDate)) {
        newWeeks = [...getWeeksInRange(weeks, week, latestDate)];
      } else if (isAfter(week, latestDate)) {
        newWeeks = [...getWeeksInRange(weeks, earliestDate, week)];
      } else {
        return prev;
      }

      if (newWeeks.length > 12) {
        setShowMaxWeeksModal(true);
        return prev;
      }

      return newWeeks;
    });
  };

  return (
    <div 
      className="stay2-container min-h-screen p-4 md:p-8 stay2-tree-pattern"
      style={{
        backgroundImage: `linear-gradient(rgba(244, 240, 232, 0.9), rgba(244, 240, 232, 0.9)), url(${BACKGROUND_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-2">
          <Trees className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-serif">the Garden</h1>
        </div>
        <p className="text-stone-600 font-mono">Escape to reality</p>
      </header>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-8 max-w-6xl mx-auto relative">
        <section className="relative">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}
              className={clsx(
                "stay2-month-nav",
                "px-3 py-1.5"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous Month
            </motion.button>
            
            <h2 className="text-3xl font-serif font-light">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            
            <motion.button
              onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
              className={clsx(
                "stay2-month-nav",
                "px-3 py-1.5"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Month
            </motion.button>
          </div>

          <div className="bg-white p-6 mb-12">
            <WeekSelector
              weeks={weeks}
              selectedWeeks={selectedWeeks}
              squigglePaths={squigglePaths}
              onToggleWeek={toggleWeek}
              isConsecutiveWeek={isConsecutiveWeek}
              isFirstOrLastSelected={isFirstOrLastSelected}
            />
          </div>
          
          <CabinSelector
            accommodations={accommodations}
            selectedAccommodation={selectedAccommodation}
            onSelectAccommodation={setSelectedAccommodation}
            selectedWeeks={selectedWeeks}
            currentMonth={currentMonth}
          />
        </section>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <BookingSummary
            selectedWeeks={selectedWeeks}
            selectedAccommodation={selectedAccommodation ? 
              accommodations.find(a => a.id === selectedAccommodation) : null}
            baseRate={245}
            onClearWeeks={() => setSelectedWeeks([])}
            onClearAccommodation={() => setSelectedAccommodation(null)}
          />
        </div>
      </div>

      <MaxWeeksModal 
        isOpen={showMaxWeeksModal}
        onClose={() => setShowMaxWeeksModal(false)}
      />
    </div>
  );
}