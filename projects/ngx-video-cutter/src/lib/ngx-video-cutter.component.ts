import { NgxVideoCutterService } from './ngx-video-cutter.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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

  @Output() onCut = new EventEmitter<Blob>();

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
    this.isBusy = true;
    const blob = await this.ngxVideoCutterService.trim(this.fileId, this.startTime, this.endTime);
    this.onCut.emit(blob);
    this.isBusy = false;
  }

}
