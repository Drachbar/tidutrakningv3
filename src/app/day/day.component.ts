import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, startWith} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-day',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss'
})
export class DayComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() weekNo!: string;
  @Input() dayName!: string;

  workingHours$!: Observable<string>;

  ngOnInit() {
    this.workingHours$ = this.createWorkingHoursObservable();
  }

  inputId(type: string): string {
    return `${this.weekNo}-${this.dayName}-${type}`;
  }

  createWorkingHoursObservable(): Observable<string> {
    return this.formGroup.valueChanges.pipe(
      startWith(this.formGroup.value),
      map(value => {
        if (!value.start || !value.end || !value.lunchOut || !value.lunchIn) {
          return '0:00'; // Returnera 0 om något värde saknas
        }

        // Konvertera tiderna till Date-objekt för enklare beräkning
        const startTime = this.parseTime(value.start);
        const endTime = this.parseTime(value.end);
        const lunchOutTime = this.parseTime(value.lunchOut);
        const lunchInTime = this.parseTime(value.lunchIn);

        // Beräkna total tid i millisekunder
        const totalTime = endTime.getTime() - startTime.getTime();
        const lunchTime = lunchInTime.getTime() - lunchOutTime.getTime();

        // Arbetad tid = total tid minus lunchtid
        const workingTimeMs = totalTime - lunchTime;

        // Konvertera till timmar och minuter
        const hours = Math.floor(workingTimeMs / (1000 * 60 * 60));
        const minutes = Math.floor((workingTimeMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}:${minutes.toString().padStart(2, '0')}`;
      })
    );
  }

  // Hjälpmetod för att parsa tidsträngar till Date-objekt
  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}
