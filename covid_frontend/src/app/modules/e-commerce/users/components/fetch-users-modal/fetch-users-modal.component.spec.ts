import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchUsersModalComponent } from './fetch-users-modal.component';

describe('FetchUsersModalComponent', () => {
  let component: FetchUsersModalComponent;
  let fixture: ComponentFixture<FetchUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
