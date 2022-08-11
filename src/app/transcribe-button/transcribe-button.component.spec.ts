import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscribeButtonComponent } from './transcribe-button.component';

describe('TranscribeButtonComponent', () => {
  let component: TranscribeButtonComponent;
  let fixture: ComponentFixture<TranscribeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscribeButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscribeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
