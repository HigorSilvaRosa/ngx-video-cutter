import { NgxVideoCutterService } from './../ngx-video-cutter.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-video-cutter-time-frame',
  templateUrl: './ngx-video-cutter-time-frame.component.html',
  styleUrls: ['./ngx-video-cutter-time-frame.component.css']
})
export class NgxVideoCutterTimeFrameComponent implements OnInit {

  @Input() fileId: string;

  constructor(
    private ngxVideoCutterService: NgxVideoCutterService
  ) { }

  ngOnInit(): void {
    this.ngxVideoCutterService.getDuration(this.fileId);
  }

}
