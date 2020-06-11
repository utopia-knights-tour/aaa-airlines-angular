import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerModalComponent } from './customer-modal.component';
import { HttpClientModule } from '@angular/common/http';

xdescribe('CustomerModalComponent', () => {
  let component: CustomerModalComponent;
  let fixture: ComponentFixture<CustomerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerModalComponent ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
