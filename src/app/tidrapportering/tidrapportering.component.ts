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
import {CalendarCalculatorService} from '../service/calendar-calculator.service';

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
  @ViewChild('loadMoreTrigger', {static: false}) loadMoreTrigger!: ElementRef;
  fb = inject(FormBuilder);
  calendarCalcService = inject(CalendarCalculatorService);
  destroyRef = inject(DestroyRef);
  weekNo = model<number>(this.calendarCalcService.getCurrentWeek());
  year = model<number>(this.calendarCalcService.getCurrentYear());
  timeForm: FormGroup = this.fb.group({
    weeks: this.fb.array([]),
  });

  weekStartDate = computed(() =>
    this.calendarCalcService.getDateByYearWeekDayIndex(this.year(), this.weekNo(), 1).toISOString().split('T')[0]
  )
  weekEndDate = computed(() =>
    this.calendarCalcService.getDateByYearWeekDayIndex(this.year(), this.weekNo(), 7).toISOString().split('T')[0]
  )

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
    }, {rootMargin: '400px'});

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
        year: [week.year],
        weekNo: [week.weekNo],
        monday: this.restoreDay(week.monday),
        tuesday: this.restoreDay(week.tuesday),
        wednesday: this.restoreDay(week.wednesday),
        thursday: this.restoreDay(week.thursday),
        friday: this.restoreDay(week.friday),
        saturday: this.restoreDay(week.saturday),
        sunday: this.restoreDay(week.sunday),
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

  addWeek(weekNo: number, year: number) {
    const mondayDate = this.calendarCalcService.getDateByYearWeekDayIndex(year, weekNo, 1);

    const weekForm = this.fb.group({
      year: [year],
      weekNo: [weekNo],
      monday: this.createDay(new Date(mondayDate)),
      tuesday: this.createDay(this.calendarCalcService.cloneAddDays(mondayDate, 1)),
      wednesday: this.createDay(this.calendarCalcService.cloneAddDays(mondayDate, 2)),
      thursday: this.createDay(this.calendarCalcService.cloneAddDays(mondayDate, 3)),
      friday: this.createDay(this.calendarCalcService.cloneAddDays(mondayDate, 4)),
      saturday: this.createDay(this.calendarCalcService.cloneAddDays(mondayDate, 5)),
      sunday: this.createDay(this.calendarCalcService.cloneAddDays(mondayDate, 6)),
    });
    this.weeks.push(weekForm);
    this.weeksSignal.set([...this.weeks.controls]);
    this.weekNo.set(this.weekNo() + 1)
  }

  restoreDay(day: any): FormGroup {
    return this.fb.group({
      date: [new Date(day.date.split('T')[0])],
      start: [day.start ? day.start : null],
      lunchOut: [day.lunchOut ? day.lunchOut : null],
      lunchIn: [day.lunchIn ? day.lunchIn : null],
      end: [day.end ? day.end : null],
    });
  }

  createDay(date: Date): FormGroup {
    return this.fb.group({
      date: [date],
      start: [null],
      lunchOut: [null],
      lunchIn: [null],
      end: [null],
    });
  }

  removeWeek(weekNo: number) {
    const index = this.weeks.value.findIndex((val: any) => val.weekNo === weekNo);
    this.weeks.removeAt(index);
    this.weeksSignal.set([...this.weeks.controls]);
  }

  getCurrentWeek(): number {
    console.log(this.calendarCalcService.getCurrentWeek())
    return this.calendarCalcService.getCurrentWeek();
  }
}
