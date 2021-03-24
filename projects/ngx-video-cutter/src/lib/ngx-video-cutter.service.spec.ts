import { TestBed } from '@angular/core/testing';

import { NgxVideoCutterService } from './ngx-video-cutter.service';

describe('NgxVideoCutterService', () => {
  let service: NgxVideoCutterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxVideoCutterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
