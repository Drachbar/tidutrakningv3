import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HolidayServiceService {

  rodaDagar = new Map([
    ['1-1', 'Nyårsdagen'],
    ['1-6', 'Trettondedag jul'],
    ['5-1', 'Första maj'],
    ['6-6', 'Sveriges nationaldag'],
    ['12-24', 'Julafton'],
    ['12-25', 'Juldagen'],
    ['12-26', 'Annandag jul'],
    ['12-31', 'Nyårsafton'],
  ]);

  public getHoliday(date: Date) {
    console.log(date)
    console.log(date.getFullYear());
  }

}
