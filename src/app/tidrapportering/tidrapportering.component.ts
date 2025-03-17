import {
  AfterViewInit,
  Component, computed,
  DestroyRef,
  ElementRef,
  inject,
  model,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {WeekComponent} from '../week/week.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tidrapportering',
  imports: [
    FormsModule,
    WeekComponent,
  ],
  templateUrl: './tidrapportering.component.html',
  styleUrl: './tidrapportering.component.scss'
})
export class TidrapporteringComponent implements OnInit, AfterViewInit {
  @ViewChild('loadMoreTrigger', { static: false }) loadMoreTrigger!: ElementRef;
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  weekNo = model<number>(1);
  timeForm: FormGroup = this.fb.group({
    weeks: this.fb.array([]),
  });

  displayedWeeks = signal(3);

  latestWeeks = computed(() =>
    this.weeksSignal().slice(-this.displayedWeeks()).reverse()
  );

  weeksSignal = signal(this.weeks.controls); // Skapa en signal


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

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMoreWeeks();
      }
    }, { rootMargin: '400px' });

    observer.observe(this.loadMoreTrigger.nativeElement);
  }

  loadMoreWeeks() {
    if (this.displayedWeeks() < this.weeks.controls.length) {
      this.displayedWeeks.update(val => val + 5); // Ladda 5 fler veckor
    }
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
    this.weeksSignal.set([...this.weeks.controls]);
    this.weekNo.set(this.weekNo() + 1)
  }

  createDay(day?: any): FormGroup {
    return this.fb.group({
      start: [day?.start ? day.start : null],
      lunchOut: [day?.lunchOut ? day.lunchOut : null],
      lunchIn: [day?.lunchIn ? day.lunchIn : null],
      end: [day?.end ? day.end : null],
    });
  }

  printWeeks() {
    console.log(this.weeks);
  }

  removeWeek(weekNo: number) {
    const index = this.weeks.value.findIndex((val: any) => val.weekNo === weekNo);
    this.weeks.removeAt(index);
    this.weeksSignal.set([...this.weeks.controls]);
  }
}
