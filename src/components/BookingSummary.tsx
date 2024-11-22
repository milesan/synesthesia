import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, endOfWeek } from 'date-fns';
import { X, Percent } from 'lucide-react';
import type { Accommodation } from '../types';
import { getSeasonalDiscount, getSeasonName } from '../utils/pricing';
import { createBooking } from '../services/bookings';
import { useCredits } from '../hooks/useCredits';
import clsx from 'clsx';

interface Props {
  selectedWeeks: Date[];
  selectedAccommodation: Accommodation | null;
  baseRate: number;
  onClearWeeks: () => void;
  onClearAccommodation: () => void;
}

export function BookingSummary({
  selectedWeeks,
  selectedAccommodation,
  baseRate,
  onClearWeeks,
  onClearAccommodation
}: Props) {
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { credits, loading: creditsLoading, refresh: refreshCredits } = useCredits();

  if (selectedWeeks.length === 0 && !selectedAccommodation) return null;

  const numberOfWeeks = selectedWeeks.length;
  const accommodationRate = selectedAccommodation?.price || 0;

  const weeklyTotals = selectedWeeks.map(week => {
    const seasonalDiscount = getSeasonalDiscount(week);
    const weekAccommodationRate = accommodationRate * (1 - seasonalDiscount);
    return baseRate + weekAccommodationRate;
  });

  const subtotal = weeklyTotals.reduce((sum, weekly) => sum + weekly, 0);
  const totalAmount = Math.round(subtotal);

  const firstWeek = selectedWeeks[0];
  const lastWeek = selectedWeeks[selectedWeeks.length - 1];
  const lastWeekEnd = lastWeek ? endOfWeek(lastWeek) : null;

  const handleBooking = async () => {
    if (!selectedAccommodation || !firstWeek || !lastWeekEnd) return;

    if (credits < totalAmount) {
      setError(`Insufficient credits. You need €${totalAmount} but have €${credits}`);
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      await createBooking(
        selectedAccommodation.id,
        firstWeek,
        lastWeekEnd,
        totalAmount
      );

      await refreshCredits();
      onClearWeeks();
      onClearAccommodation();
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="stay2-booking-summary stay2-paper p-6">
      <h2 className="text-2xl font-serif font-light text-stone-900 mb-4">
        Summary of Stay
      </h2>

      <div className="bg-stone-50 p-6 border-2 border-stone-200">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
              <div className="space-y-2">
                <div className="stay2-summary-date">
                  {format(firstWeek, 'MMM d')} → {format(lastWeekEnd, 'MMM d')}
                </div>
                <div className="stay2-summary-details">
                  Check-in Tuesday 3-6PM · Check-out Monday 12PM
                </div>
              </div>
            )}
          </div>
        )}

        {selectedAccommodation && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{selectedAccommodation.title}</h3>
              <button
                onClick={onClearAccommodation}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {selectedWeeks.length > 0 && (
          <div className="space-y-4 text-sm border-t border-stone-200 pt-4">
            <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 font-mono">
              <div className="text-right">€{baseRate}</div>
              <div className="text-center text-stone-400">+</div>
              <div>€{accommodationRate}</div>
              <div className="text-right text-stone-500">food & facilities</div>
              <div></div>
              <div className="text-stone-500">accommodation</div>
            </div>

            <div className="flex justify-between text-lg font-medium pt-2">
              <span>Total</span>
              <span className="font-mono">€{totalAmount}</span>
            </div>

            <motion.button
              onClick={handleBooking}
              disabled={!selectedAccommodation || isBooking || creditsLoading}
              className="w-full bg-emerald-900 text-white py-3 pixel-corners hover:bg-emerald-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isBooking ? 'Processing...' : 'Book Now'}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}