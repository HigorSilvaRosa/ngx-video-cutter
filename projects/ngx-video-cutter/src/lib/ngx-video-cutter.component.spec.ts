import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxVideoCutterComponent } from './ngx-video-cutter.component';

describe('NgxVideoCutterComponent', () => {
  let component: NgxVideoCutterComponent;
  let fixture: ComponentFixture<NgxVideoCutterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxVideoCutterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxVideoCutterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
