import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { CabinRates } from '../types';

interface Props {
  cabinRates: CabinRates;
  selectedCabin: string | null;
  onSelectCabin: (cabin: string) => void;
  cabinImages: { [key: string]: string };
}

export function CabinSelector({
  cabinRates,
  selectedCabin,
  onSelectCabin,
  cabinImages
}: Props) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-display font-light text-stone-900 mb-6">
        Select Your Accommodation
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(cabinRates).map(([cabin, rate]) => (
          <motion.button
            key={cabin}
            onClick={() => onSelectCabin(cabin)}
            className={clsx(
              'relative overflow-hidden pixel-corners transition-all duration-300',
              selectedCabin === cabin ? 'border-emerald-600 shadow-lg' : 'border-stone-200'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="aspect-[4/3] relative">
              <img
                src={cabinImages[cabin]}
                alt={cabin}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-xl font-display">{cabin}</h3>
              <p className="text-stone-600">€{rate} per week</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}