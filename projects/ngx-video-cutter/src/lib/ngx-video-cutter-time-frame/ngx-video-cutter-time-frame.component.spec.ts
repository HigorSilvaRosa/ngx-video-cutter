import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxVideoCutterTimeFrameComponent } from './ngx-video-cutter-time-frame.component';

describe('NgxVideoCutterTimeFrameComponent', () => {
  let component: NgxVideoCutterTimeFrameComponent;
  let fixture: ComponentFixture<NgxVideoCutterTimeFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxVideoCutterTimeFrameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxVideoCutterTimeFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
