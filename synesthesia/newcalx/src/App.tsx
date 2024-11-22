import React, { useState, useMemo } from 'react';
import { Trees } from 'lucide-react';
import { isSameWeek, addWeeks, isAfter, isBefore } from 'date-fns';
import { WeekSelector } from './components/WeekSelector';
import { CabinSelector } from './components/CabinSelector';
import { BookingSummary } from './components/BookingSummary';
import { generateWeeks, generateSquigglePath, getWeeksInRange } from './utils/dates';
import { CabinRates } from './types';

const WEEKS_TO_SHOW = 16;
const BASE_RATE = 245;
const CABIN_RATES: CabinRates = {
  'Maple': 150,
  'Pine': 200,
  'Oak': 250,
  'Cedar': 300,
};

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2940&auto=format&fit=crop";
const CABIN_IMAGES = {
  'Maple': "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=2940&auto=format&fit=crop",
  'Pine': "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=2940&auto=format&fit=crop",
  'Oak': "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2940&auto=format&fit=crop",
  'Cedar': "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=2940&auto=format&fit=crop",
};

function App() {
  const [selectedWeeks, setSelectedWeeks] = useState<Date[]>([]);
  const [selectedCabin, setSelectedCabin] = useState<string | null>(null);
  const [squigglePaths] = useState(() => 
    Array.from({ length: WEEKS_TO_SHOW }, () => generateSquigglePath())
  );

  const weeks = useMemo(() => 
    generateWeeks(new Date(2024, 0, 1), WEEKS_TO_SHOW),
    []
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

  const toggleWeek = (week: Date) => {
    setSelectedWeeks(prev => {
      const isSelected = prev.some(w => isSameWeek(w, week));
      
      // If trying to deselect and it's not an edge week, return unchanged
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

      if (isBefore(week, earliestDate)) {
        return [...getWeeksInRange(weeks, week, latestDate)];
      }

      if (isAfter(week, latestDate)) {
        return [...getWeeksInRange(weeks, earliestDate, week)];
      }

      return prev;
    });
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-8 tree-pattern"
      style={{
        backgroundImage: `linear-gradient(rgba(244, 240, 232, 0.9), rgba(244, 240, 232, 0.9)), url(${BACKGROUND_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trees className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-mono">the Garden</h1>
        </div>
        <p className="text-stone-600 font-mono">Escape to reality</p>
      </header>

      <div className="grid lg:grid-cols-[2fr,1fr] gap-8 max-w-6xl mx-auto">
        <section>
          <WeekSelector
            weeks={weeks}
            selectedWeeks={selectedWeeks}
            squigglePaths={squigglePaths}
            onToggleWeek={toggleWeek}
            isConsecutiveWeek={isConsecutiveWeek}
            isFirstOrLastSelected={isFirstOrLastSelected}
          />
          <CabinSelector
            cabinRates={CABIN_RATES}
            selectedCabin={selectedCabin}
            onSelectCabin={setSelectedCabin}
            cabinImages={CABIN_IMAGES}
          />
        </section>

        <BookingSummary
          selectedWeeks={selectedWeeks}
          selectedCabin={selectedCabin}
          cabinRates={CABIN_RATES}
          baseRate={BASE_RATE}
          onClearWeeks={() => setSelectedWeeks([])}
          onClearCabin={() => setSelectedCabin(null)}
        />
      </div>
    </div>
  );
}

export default App;