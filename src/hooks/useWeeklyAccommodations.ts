import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Accommodation } from '../types';

export function useWeeklyAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAccommodations();

    const subscription = supabase
      .channel('accommodations_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'accommodations' 
        }, 
        () => {
          loadAccommodations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAccommodations = async () => {
    try {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('accommodations')
        .select('*')
        .order('price', { ascending: true });

      if (queryError) throw queryError;
      setAccommodations(data || []);
    } catch (err) {
      console.error('Error loading accommodations:', err);
      setError(err instanceof Error ? err : new Error('Failed to load accommodations'));
    } finally {
      setLoading(false);
    }
  };

  return { accommodations, loading, error };
}