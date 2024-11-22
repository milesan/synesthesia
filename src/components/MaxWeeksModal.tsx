import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function MaxWeeksModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="stay2-modal"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="stay2-modal-content"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif">Hold Your Horses!</h3>
              <button 
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-stone-600 mb-6">
              You may only spend 12 weeks of the year at the Garden.  Give the rest of the world a chance ❧
            </p>
            <button
              onClick={onClose}
              className="w-full bg-emerald-900 text-white py-2 transition-colors hover:bg-emerald-800"
            >
              Cool
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}