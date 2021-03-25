import { StringUtil } from './../utils/string.util';
import { NgxVideoCutterService } from './../ngx-video-cutter.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'ngx-video-cutter-time-frame',
  templateUrl: './ngx-video-cutter-time-frame.component.html',
  styleUrls: ['./ngx-video-cutter-time-frame.component.css']
})
export class NgxVideoCutterTimeFrameComponent implements OnChanges {

  @Input() fileId: string;
  @Input() time: number = 0;

  uniqueKey = StringUtil.generateId();

  url: SafeUrl;

  renderTimeout;

  isBusy = false;

  constructor(
    private ngxVideoCutterService: NgxVideoCutterService,
    private domSanitizer: DomSanitizer,
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.fileId) {
      if (this.renderTimeout) {
        clearTimeout(this.renderTimeout);
      }
      this.renderTimeout = setTimeout(async () => {
        this.url = null;
        this.isBusy = true;
        const objectUrl = await this.ngxVideoCutterService.getFrame(this.fileId, this.time, this.uniqueKey);
        this.isBusy = false;
        this.url = this.domSanitizer.bypassSecurityTrustUrl(objectUrl);
        delete this.renderTimeout;
      }, 1500);
    }

  }

}
