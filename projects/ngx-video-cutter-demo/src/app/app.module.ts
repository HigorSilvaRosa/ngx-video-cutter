import { NgxVideoCutterModule } from './../../../ngx-video-cutter/src/lib/ngx-video-cutter.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxVideoCutterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
