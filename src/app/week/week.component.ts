import {Component, effect, Input, signal} from '@angular/core';
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
export class WeekComponent {
  @Input({required: true}) week!: FormGroup;
  showWeekends = signal(false); // Skapa en signal istället för en vanlig variabel
  weekNo = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.weekNo.set(this.week.get('weekNo')?.value || null);
    });
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
}
