import {Component, computed, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DayComponent} from '../day/day.component';
import { IonCard, IonCardHeader, IonCardTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCardContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-week',
  imports: [
    ReactiveFormsModule,
    DayComponent, IonCard, IonCardHeader, IonCardTitle, IonButton, IonGrid, IonRow, IonCol, IonCardContent
  ],
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss',
})
export class WeekComponent implements OnInit {
  @Input({required: true}) week!: FormGroup;
  @Output() removeWeek = new EventEmitter<number>();

  showWeekends = signal(false); // Skapa en signal istället för en vanlig variabel
  weekNo = computed(() => this.week.get('weekNo')?.value || null);
  year = computed(() => this.week.get('year')?.value || null);

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
    const { start, lunchOut, lunchIn, end } = day;
    return [start, lunchOut, lunchIn, end].every(value => value === null);
  }

  protected readonly parseInt = parseInt;
}
