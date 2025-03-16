import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidrapporteringComponent } from './tidrapportering.component';

describe('TidrapporteringComponent', () => {
  let component: TidrapporteringComponent;
  let fixture: ComponentFixture<TidrapporteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TidrapporteringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TidrapporteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
