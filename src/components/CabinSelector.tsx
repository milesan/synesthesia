import React from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import clsx from 'clsx';
import type { Accommodation } from '../types';
import { supabase } from '../lib/supabase';
import { getSeasonalDiscount } from '../utils/pricing';

interface Props {
  accommodations: Accommodation[];
  selectedAccommodation: string | null;
  onSelectAccommodation: (id: string) => void;
  selectedWeeks: Date[];
  currentMonth: Date;
}

export function CabinSelector({
  accommodations,
  selectedAccommodation,
  onSelectAccommodation,
  selectedWeeks,
  currentMonth
}: Props) {
  const [availabilityMap, setAvailabilityMap] = React.useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const availabilityCache = React.useRef<Record<string, boolean>>({});

  // Calculate length discount based on number of weeks
  const getLengthDiscount = (weeks: number) => {
    if (weeks >= 12) return 0.20;
    if (weeks >= 8) return 0.175;
    if (weeks >= 6) return 0.15;
    if (weeks >= 4) return 0.125;
    if (weeks >= 2) return 0.10;
    return 0;
  };

  // Calculate total discount including seasonal and length discounts
  const calculateTotalDiscount = (accommodation: Accommodation) => {
    if (selectedWeeks.length === 0) return 0;

    const lengthDiscount = getLengthDiscount(selectedWeeks.length);
    const seasonalDiscounts = selectedWeeks.map(week => getSeasonalDiscount(week));
    const avgSeasonalDiscount = seasonalDiscounts.reduce((a, b) => a + b) / seasonalDiscounts.length;

    // Apply both discounts
    const totalDiscount = lengthDiscount + avgSeasonalDiscount;
    return Math.min(totalDiscount, 0.45); // Cap total discount at 45%
  };

  // Calculate discounted price
  const getDiscountedPrice = (accommodation: Accommodation) => {
    const totalDiscount = calculateTotalDiscount(accommodation);
    return Math.round(accommodation.price * (1 - totalDiscount));
  };

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkAvailability = async () => {
      if (selectedWeeks.length === 0) {
        setAvailabilityMap({});
        return;
      }

      const firstWeek = selectedWeeks[0];
      const lastWeek = selectedWeeks[selectedWeeks.length - 1];
      const cacheKey = `${firstWeek.toISOString()}-${lastWeek.toISOString()}`;

      if (availabilityCache.current[cacheKey]) {
        setAvailabilityMap(availabilityCache.current[cacheKey]);
        return;
      }

      setIsLoading(true);

      try {
        const startDate = firstWeek;
        const endDate = addDays(lastWeek, 7);

        const { data: unavailableDates, error } = await supabase
          .from('availability')
          .select('accommodation_id, date')
          .in('status', ['BOOKED', 'HOLD'])
          .gte('date', startDate.toISOString().split('T')[0])
          .lt('date', endDate.toISOString().split('T')[0])
          .abortSignal(controller.signal);

        if (error) throw error;

        if (isMounted) {
          const newAvailabilityMap: Record<string, boolean> = {};
          accommodations.forEach(acc => {
            const hasUnavailableDates = unavailableDates?.some(
              date => date.accommodation_id === acc.id
            ) ?? false;
            newAvailabilityMap[acc.id] = !hasUnavailableDates;
          });

          setAvailabilityMap(newAvailabilityMap);
          availabilityCache.current[cacheKey] = newAvailabilityMap;
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error checking availability:', error);
          const errorMap: Record<string, boolean> = {};
          accommodations.forEach(acc => {
            errorMap[acc.id] = false;
          });
          if (isMounted) {
            setAvailabilityMap(errorMap);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAvailability();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedWeeks, accommodations]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-serif font-light text-stone-900 mb-6">
        Select Your Accommodation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accommodations?.map((accommodation) => {
          const isAvailable = selectedWeeks.length === 0 || 
            (!isLoading && availabilityMap[accommodation.id]);
          
          const discountedPrice = getDiscountedPrice(accommodation);
          const totalDiscount = calculateTotalDiscount(accommodation);
          const hasDiscount = totalDiscount > 0;
          
          return (
            <motion.button
              key={accommodation.id}
              onClick={() => isAvailable && onSelectAccommodation(accommodation.id)}
              className={clsx(
                'stay2-accommodation-card',
                selectedAccommodation === accommodation.id && 'selected',
                !isAvailable && 'opacity-50 cursor-not-allowed grayscale'
              )}
              whileHover={isAvailable ? { scale: 1.02 } : undefined}
              whileTap={isAvailable ? { scale: 0.98 } : undefined}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={accommodation.image_url}
                  alt={accommodation.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-xl font-serif">{accommodation.title}</h3>
                <div className="mt-1">
                  {hasDiscount ? (
                    <>
                      <p className="text-emerald-700 font-medium">
                        €{discountedPrice}/week
                        <span className="text-stone-400 text-sm ml-2">❧</span>
                        <span className="text-stone-400 line-through text-sm ml-2">
                          €{accommodation.price} base
                        </span>
                      </p>
                      <p className="text-sm text-emerald-600 mt-1">
                        {Math.round(totalDiscount * 100)}% reduction applied
                      </p>
                    </>
                  ) : (
                    <p className="text-stone-600">€{accommodation.price} per week</p>
                  )}
                </div>
                {!isAvailable && selectedWeeks.length > 0 && (
                  <div className="mt-2 text-sm text-rose-600">
                    Not available for selected dates
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}