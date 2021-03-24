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

  constructor(
    private ngxVideoCutterService: NgxVideoCutterService
  ) { }

  ngOnInit(): void {
  }

  async onFileChange(e: any) {
    const file: File = e.target.files?.item(0);
    this.fileId = await this.ngxVideoCutterService.openFile(file);
  }

}
