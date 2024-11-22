import React from 'react';
import { motion } from 'framer-motion';
import { format, endOfWeek } from 'date-fns';
import { X } from 'lucide-react';
import type { CabinRates } from '../types';

interface Props {
  selectedWeeks: Date[];
  selectedCabin: string | null;
  cabinRates: CabinRates;
  baseRate: number;
  onClearWeeks: () => void;
  onClearCabin: () => void;
}

export function BookingSummary({
  selectedWeeks,
  selectedCabin,
  cabinRates,
  baseRate,
  onClearWeeks,
  onClearCabin
}: Props) {
  if (selectedWeeks.length === 0 && !selectedCabin) return null;

  const numberOfWeeks = selectedWeeks.length;
  const cabinRate = selectedCabin ? cabinRates[selectedCabin] : 0;
  const totalAmount = numberOfWeeks * (baseRate + cabinRate);

  const firstWeek = selectedWeeks[0];
  const lastWeek = selectedWeeks[selectedWeeks.length - 1];
  const lastWeekEnd = lastWeek ? endOfWeek(lastWeek) : null;

  return (
    <div className="pixel-corners bg-white p-6">
      <h2 className="text-2xl font-display font-light text-stone-900 mb-4">
        Booking Summary
      </h2>

      {selectedWeeks.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{numberOfWeeks} weeks</h3>
            <button
              onClick={onClearWeeks}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {firstWeek && lastWeekEnd && (
            <div className="space-y-2 text-sm text-stone-600">
              <div>
                {format(firstWeek, 'MMM d')} → {format(lastWeekEnd, 'MMM d')}
              </div>
              <div>
                Check-in Tuesday · Check-out Monday
              </div>
            </div>
          )}
        </div>
      )}

      {selectedCabin && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{selectedCabin}</h3>
            <button
              onClick={onClearCabin}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {selectedWeeks.length > 0 && (
        <div className="space-y-2 text-sm border-t border-stone-200 pt-4">
          <div className="flex justify-between">
            <span>Base rate</span>
            <span>€{baseRate}/week</span>
          </div>
          {selectedCabin && (
            <div className="flex justify-between">
              <span>Accommodation rate</span>
              <span>+€{cabinRate}/week</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-medium pt-2">
            <span>Total</span>
            <span>€{totalAmount}</span>
          </div>

          <motion.button
            disabled={!selectedCabin}
            className="w-full mt-4 bg-emerald-900 text-white py-3 pixel-corners hover:bg-emerald-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Now
          </motion.button>
        </div>
      )}
    </div>
  );
}