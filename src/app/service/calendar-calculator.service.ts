import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarCalculatorService {

  dayMap = new Map([
    ['Måndag', 1],
    ['Tisdag', 2],
    ['Onsdag', 3],
    ['Torsdag', 4],
    ['Fredag', 5],
    ['Lördag', 6],
    ['Söndag', 7],
  ])

  getDateByYearWeekDayIndex(year: number, week: number, dayIndex: number) {
    // ISO 8601: vecka 1 är veckan med årets första torsdag
    const firstThursday = new Date(year, 0, 4);
    const dayOfWeek = firstThursday.getDay(); // 0 = söndag, 1 = måndag, ..., 6 = lördag
    const firstMonday = new Date(firstThursday);
    firstMonday.setDate(firstThursday.getDate() - ((dayOfWeek + 6) % 7)); // backa till måndag

    const targetDate = new Date(firstMonday);
    targetDate.setDate(firstMonday.getDate() + (week - 1) * 7 + (dayIndex));

    return targetDate;
  }

  getDayIndexByName(day: string): number {
    return this.dayMap.get(day) ?? 0;
  }

  getCurrentWeek(): number {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getDateForWeekday(weekNo: number, year: number, dayIndex: number): string {
    // Hitta första torsdagen i året (ISO 8601 säger att vecka 1 är den vecka som innehåller årets första torsdag)
    const firstThursday = new Date(year, 0, 4); // 4 januari är alltid en torsdag eller senare
    const dayOfWeek = firstThursday.getDay(); // Hämtar veckodagen för 4 januari (0 = Söndag, 1 = Måndag, ..., 6 = Lördag)

    // Räkna ut första måndagen i året
    const firstMonday = new Date(firstThursday);
    firstMonday.setDate(firstThursday.getDate() - ((dayOfWeek + 6) % 7)); // Backa till måndagen

    // Beräkna första dagen i den önskade veckan
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (weekNo - 1) * 7 + dayIndex);

    return weekStart.toISOString().split('T')[0];
  }

  cloneAddDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
}
