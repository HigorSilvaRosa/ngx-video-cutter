import { NgModule } from '@angular/core';
import { NgxVideoCutterComponent } from './ngx-video-cutter.component';
import { NgxVideoCutterTimeFrameComponent } from './ngx-video-cutter-time-frame/ngx-video-cutter-time-frame.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    NgxVideoCutterComponent,
    NgxVideoCutterTimeFrameComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [NgxVideoCutterComponent]
})
export class NgxVideoCutterModule { }
