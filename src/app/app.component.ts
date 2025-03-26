import {Component} from '@angular/core';
import {TidrapporteringComponent} from './tidrapportering/tidrapportering.component';
import { IonApp, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  imports: [TidrapporteringComponent, IonApp, IonContent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tidsutrakning3';
}
