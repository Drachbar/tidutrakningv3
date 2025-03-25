import {Component} from '@angular/core';
import {TidrapporteringComponent} from './tidrapportering/tidrapportering.component';

@Component({
  selector: 'app-root',
  imports: [TidrapporteringComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tidsutrakning3';
}
