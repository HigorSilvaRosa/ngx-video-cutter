import { NgModule } from '@angular/core';
import { NgxVideoCutterComponent } from './ngx-video-cutter.component';
import { NgxVideoCutterTimeFrameComponent } from './ngx-video-cutter-time-frame/ngx-video-cutter-time-frame.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeDisplayPipe } from './time-display.pipe';



@NgModule({
  declarations: [
    NgxVideoCutterComponent,
    NgxVideoCutterTimeFrameComponent,
    TimeDisplayPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    NgxVideoCutterComponent,
    NgxVideoCutterTimeFrameComponent
  ]
})
export class NgxVideoCutterModule { }
