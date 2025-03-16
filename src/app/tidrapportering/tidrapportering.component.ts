import {Component, DestroyRef, inject, model, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {WeekComponent} from '../week/week.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tidrapportering',
  imports: [
    FormsModule,
    WeekComponent
  ],
  templateUrl: './tidrapportering.component.html',
  styleUrl: './tidrapportering.component.scss'
})
export class TidrapporteringComponent implements OnInit {
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  weekNo = model<number>(1);
  timeForm: FormGroup = this.fb.group({
    weeks: this.fb.array([]),
  });

  ngOnInit() {
    const fromLocalStorage = localStorage.getItem('times');
    if (fromLocalStorage) {
      try {
        const parsedData = JSON.parse(fromLocalStorage);
        if (parsedData?.weeks?.length) {
          this.restoreWeeks(parsedData.weeks);
        }
      } catch (error) {
        console.error('Fel vid parsing av localStorage-data:', error);
      }
    }

    this.timeForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      localStorage.setItem('times', JSON.stringify(value));
    });
  }

  restoreWeeks(storedWeeks: any[]) {
    this.weeks.clear(); // Rensa tidigare data i FormArray

    storedWeeks.forEach(week => {
      const weekForm = this.fb.group({
        weekNo: [week.weekNo],
        monday: this.createDay(week.monday),
        tuesday: this.createDay(week.tuesday),
        wednesday: this.createDay(week.wednesday),
        thursday: this.createDay(week.thursday),
        friday: this.createDay(week.friday),
        saturday: this.createDay(week.saturday),
        sunday: this.createDay(week.sunday),
      });
      this.weeks.push(weekForm);
    });

    // Uppdatera weekNo för att börja från senaste veckan
    const lastWeekNo = storedWeeks[storedWeeks.length - 1]?.weekNo ?? 0;
    this.weekNo.set(lastWeekNo + 1);
  }

  get weeks(): FormArray<FormGroup> {
    return this.timeForm.get('weeks') as FormArray;
  }

  addWeek(weekNo: number) {
    const weekForm = this.fb.group({
      weekNo: [weekNo],
      monday: this.createDay(),
      tuesday: this.createDay(),
      wednesday: this.createDay(),
      thursday: this.createDay(),
      friday: this.createDay(),
      saturday: this.createDay(),
      sunday: this.createDay(),
    });
    this.weeks.push(weekForm);
    this.weekNo.set(this.weekNo() + 1)
  }

  createDay(day?: any): FormGroup {
    return this.fb.group({
      start: [day?.start ?? null],
      lunchOut: [day?.lunchOut ?? null],
      lunchIn: [day?.lunchIn ?? null],
      end: [day?.end ?? null],
    });
  }

  printWeeks() {
    console.log(this.weeks);
  }
}
