export function getSeasonalDiscount(date: Date): number {
  const month = date.getMonth();
  // High Season (July, August, September) - No discount
  if (month >= 6 && month <= 8) return 0;
  // Shoulder Season (June, October) - 15% discount
  if (month === 5 || month === 9) return 0.15;
  // Slow Season (November-May) - 30% discount
  return 0.30;
}

export function getSeasonName(date: Date): string {
  const discount = getSeasonalDiscount(date);
  return discount === 0 ? 'High Season' : 
         discount === 0.15 ? 'Shoulder Season' : 
         'Slow Season';
}