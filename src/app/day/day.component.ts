import {Component, Input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-day',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss'
})
export class DayComponent {
  @Input() formGroup!: FormGroup;
  @Input() weekNo!: string;
  @Input() dayName!: string;

  inputId(type: string): string {
    return `${this.weekNo}-${this.dayName}-${type}`;
  }

  getWorkingHours(): string {
    const start = this.formGroup.get('start')?.value;
    const end = this.formGroup.get('end')?.value;
    const lunchOut = this.formGroup.get('lunchOut')?.value;
    const lunchIn = this.formGroup.get('lunchIn')?.value;

    if (!start || !end || !lunchOut || !lunchIn) {
      return '0:00'; // Returnera 0 om något värde saknas
    }

    // Konvertera tiderna till Date-objekt för enklare beräkning
    const startTime = this.parseTime(start);
    const endTime = this.parseTime(end);
    const lunchOutTime = this.parseTime(lunchOut);
    const lunchInTime = this.parseTime(lunchIn);

    // Beräkna total tid i millisekunder
    const totalTime = endTime.getTime() - startTime.getTime();
    const lunchTime = lunchInTime.getTime() - lunchOutTime.getTime();

    // Arbetad tid = total tid minus lunchtid
    const workingTimeMs = totalTime - lunchTime;

    // Konvertera till timmar och minuter
    const hours = Math.floor(workingTimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((workingTimeMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  // Hjälpmetod för att parsa tidsträngar till Date-objekt
  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}
