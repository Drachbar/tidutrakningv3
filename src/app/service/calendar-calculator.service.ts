import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarCalculatorService {

  getCurrentWeek(): number {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const yearStart = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  getDateForWeekday(weekNo: number, year: number, dayIndex: number): string {
    // Hitta första torsdagen i året (ISO 8601 säger att vecka 1 är den vecka som innehåller årets första torsdag)
    const firstThursday = new Date(year, 0, 4); // 4 januari är alltid en torsdag eller senare
    const dayOfWeek = firstThursday.getDay(); // Hämtar veckodagen för 4 januari (0 = Söndag, 1 = Måndag, ..., 6 = Lördag)

    // Räkna ut första måndagen i året
    const firstMonday = new Date(firstThursday);
    firstMonday.setDate(firstThursday.getDate() - ((dayOfWeek + 6) % 7)); // Backa till måndagen

    // Justera dayIndex så att 0 = måndag, 1 = tisdag, ..., 4 = fredag
    const adjustedDayIndex = dayIndex + 1;

    // Beräkna första dagen i den önskade veckan
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (weekNo - 1) * 7 + adjustedDayIndex);

    return weekStart.toISOString().split('T')[0];
  }
}
