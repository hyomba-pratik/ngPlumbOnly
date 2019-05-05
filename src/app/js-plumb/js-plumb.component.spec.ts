import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsPlumbComponent } from './js-plumb.component';

describe('JsPlumbComponent', () => {
  let component: JsPlumbComponent;
  let fixture: ComponentFixture<JsPlumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsPlumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsPlumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
