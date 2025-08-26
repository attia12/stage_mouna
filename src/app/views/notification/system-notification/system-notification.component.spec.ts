import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemNotificationComponent } from './system-notification.component';

describe('SystemNotificationComponent', () => {
  let component: SystemNotificationComponent;
  let fixture: ComponentFixture<SystemNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
