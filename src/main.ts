/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { add, time, cafeOutline, fastFood, logOut } from 'ionicons/icons';

addIcons({
  add, 
  time,
  cafeOutline,
  fastFood,
  logOut
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

