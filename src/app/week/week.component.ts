import {Component, computed, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DayComponent} from '../day/day.component';

@Component({
  selector: 'app-week',
  imports: [
    ReactiveFormsModule,
    DayComponent
  ],
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss'
})
export class WeekComponent implements OnInit {
  @Input({required: true}) week!: FormGroup;
  @Output() removeWeek = new EventEmitter<number>();

  showWeekends = signal(false); // Skapa en signal istället för en vanlig variabel
  weekNo = computed(() => this.week.get('weekNo')?.value || null);

  ngOnInit() {
    if (!this.isEmptyDay(this.week.value.saturday) || !this.isEmptyDay(this.week.value.sunday)) {
      this.showWeekends.set(true);
    }
  }

  toggleWeekends() {
    this.showWeekends.update(value => !value); // Uppdatera signalen
  }

  get days(): { name: string; group: FormGroup }[] {
    return [
      { name: 'Måndag', group: this.week.get('monday') as FormGroup },
      { name: 'Tisdag', group: this.week.get('tuesday') as FormGroup },
      { name: 'Onsdag', group: this.week.get('wednesday') as FormGroup },
      { name: 'Torsdag', group: this.week.get('thursday') as FormGroup },
      { name: 'Fredag', group: this.week.get('friday') as FormGroup },
      { name: 'Lördag', group: this.week.get('saturday') as FormGroup },
      { name: 'Söndag', group: this.week.get('sunday') as FormGroup },
    ];
  }

  isEmptyDay(day: any) {
    return Object.values(day).every(value => value === null)
  }

  getFormattedDate(dayIndex: number): string {
    return this.getDateForWeekday(this.weekNo(), 2027, dayIndex);
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


  xgetDateForWeekday(weekNo: number, year: number, dayIndex: number): string {
    console.log('weekNo:' + weekNo)
    console.log('year:' + year)
    console.log('dayIndex:' + dayIndex)

    // Hitta den första torsdagen i året (ISO 8601 säger att vecka 1 är den vecka som innehåller årets första torsdag)
    const firstThursday = new Date(year, 0, 4); // 4 januari är alltid en torsdag eller senare
    const firstMonday = new Date(firstThursday);
    firstMonday.setDate(firstThursday.getDate() - (firstThursday.getDay() - 1)); // Backa till måndagen

    // Beräkna första dagen i den önskade veckan
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (weekNo - 1) * 7 + dayIndex - 1);

    const date = weekStart.toISOString().split('T')[0];

    console.log(date)

    return date;
  }

  protected readonly parseInt = parseInt;
}
