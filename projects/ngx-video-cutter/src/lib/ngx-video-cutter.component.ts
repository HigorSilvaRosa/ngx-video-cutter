import { NgxVideoCutterService } from './ngx-video-cutter.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-video-cutter',
  templateUrl: './ngx-video-cutter.component.html',
  styleUrls: ['./ngx-video-cutter.component.scss'],
})
export class NgxVideoCutterComponent implements OnInit {

  selectedFile: File;
  fileId: string;
  duration: number;
  startTime: number = 0;
  endTime: number;

  isBusy = false;

  constructor(
    private ngxVideoCutterService: NgxVideoCutterService
  ) { }

  ngOnInit(): void {
  }

  async onFileChange(e: any) {
    this.selectedFile = e.target.files?.item(0);
    this.fileId = await this.ngxVideoCutterService.openFile(this.selectedFile);
    this.duration = await this.ngxVideoCutterService.getDuration(this.fileId);
    this.endTime = Math.floor(this.duration / 2);
  }

  async onStartTimeChange(e: any) {
    if (this.startTime > this.endTime) {
      this.endTime = this.startTime;
    }
  }

  async cut() {
    const res = await this.ngxVideoCutterService.trim(this.fileId, this.startTime, this.endTime);
    const a = document.createElement('a');
    a.setAttribute("href", res);
    a.setAttribute("download", 'video.mp4');
    a.click();
    window.URL.revokeObjectURL(res);
  }

}
