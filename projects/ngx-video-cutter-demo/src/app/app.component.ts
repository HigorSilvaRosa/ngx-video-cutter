import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'ngx-video-cutter-demo';

  download(blob: Blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a');
    a.setAttribute("href", url);
    a.setAttribute("download", 'video.mp4');
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
