import { addWeeks, startOfWeek, addDays } from 'date-fns';

export function generateWeeks(startDate: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => 
    startOfWeek(addWeeks(startDate, i))
  );
}

export function generateSquigglePath(): string {
  const width = 100;
  const height = 30;
  const segments = 8;
  const segmentWidth = width / segments;
  
  let path = `M 0 ${height / 2}`;
  
  for (let i = 0; i < segments; i++) {
    const x1 = i * segmentWidth + segmentWidth / 3;
    const x2 = (i + 1) * segmentWidth;
    const y1 = i % 2 === 0 ? height * 0.2 : height * 0.8;
    const y2 = height / 2;
    
    path += ` C ${x1} ${y1}, ${x1} ${y1}, ${x2} ${y2}`;
  }
  
  return path;
}

export function getWeeksInRange(weeks: Date[], start: Date, end: Date): Date[] {
  const startWeek = startOfWeek(start);
  const endWeek = startOfWeek(end);
  
  return weeks.filter(week => {
    const weekStart = startOfWeek(week);
    return weekStart >= startWeek && weekStart <= endWeek;
  });
}

export function getWeekDates(week: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(week, i));
}