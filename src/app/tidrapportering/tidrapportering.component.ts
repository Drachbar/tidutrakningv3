import {Component, inject, model} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {WeekComponent} from '../week/week.component';

@Component({
  selector: 'app-tidrapportering',
  imports: [
    FormsModule,
    WeekComponent
  ],
  templateUrl: './tidrapportering.component.html',
  styleUrl: './tidrapportering.component.scss'
})
export class TidrapporteringComponent {
  fb = inject(FormBuilder);
  weekNo = model<number>(1);
  timeForm: FormGroup = this.fb.group({
    weeks: this.fb.array([]),
  });

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

  createDay(): FormGroup {
    return this.fb.group({
      start: [null],
      lunchOut: [null],
      lunchIn: [null],
      end: [null],
    });
  }

  printWeeks() {
    console.log(this.weeks);
  }
}
