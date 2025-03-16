import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-week',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss'
})
export class WeekComponent {
  @Input({required: true}) week!: FormGroup;

  logWeek() {
    console.log(this.week);
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

  // get days(): FormGroup[] {
  //   const days: FormGroup[] = []
  //   days.push(this.week.get('monday') as FormGroup)
  //   days.push(this.week.get('tuesday') as FormGroup)
  //   days.push(this.week.get('wednesday') as FormGroup)
  //   days.push(this.week.get('thursday') as FormGroup)
  //   days.push(this.week.get('friday') as FormGroup)
  //   days.push(this.week.get('saturday') as FormGroup)
  //   days.push(this.week.get('sunday') as FormGroup)
  //   return days
  // }
}
