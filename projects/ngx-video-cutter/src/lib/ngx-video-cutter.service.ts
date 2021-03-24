import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';

interface RunTask {
  id: string;
  command: string;
}

interface LogData {
  type: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NgxVideoCutterService {

  ffmpegMap: { [fileId: string]: FFmpeg } = {};

  ffmpegBusyMap: { [fileId: string]: boolean } = {};

  runPipelineMap: { [fileId: string]: RunTask[] } = {};
  doneRunPipelineMap: { [runId: string]: boolean } = {};

  ffmpegLogMap: { [fileId: string]: LogData[] } = {};
  ffmpegLogResponseMap: { [runId: string]: LogData[] } = {};

  constructor() {
  }

  async openFile(videoFile: File): Promise<string> {
    const fileId = new Date().getTime().toString();
    this.ffmpegMap[fileId] = createFFmpeg({ log: false });
    await this.ffmpegMap[fileId].load();
    this.ffmpegMap[fileId].FS('writeFile', 'video.mp4', await fetchFile(videoFile));
    this.ffmpegMap[fileId].setLogger((log: LogData) => {
      this.ffmpegLogMap[fileId].push(log);
    })
    this.runPipelineMap[fileId] = [];
    this.ffmpegLogMap[fileId] = [];
    return fileId;
  }

  async getFrame(fileId: string, time: string) {
    await this.ffmpegMap[fileId].run('-i', 'video.mp4', '-ss', '00:00:01.00', '-frames:v', '1', 'frame.jpg');
    const frameData = this.ffmpegMap[fileId].FS('readFile', 'frame.jpg');
    console.log(frameData);
    return frameData;
  }

  async getDuration(fileId: string) {
    this.run(fileId, '-i video.mp4');
  }

  private async run(fileId: string, command: string): Promise<string> {
    const runId = new Date().getTime().toString();
    this.runPipelineMap[fileId].push({ id: runId, command });
    this.process(fileId);
    const logs = await this.waitRunFinish(runId);
    let logText = '';
    for (const log of logs) {
      logText += log.message + '\n';
    }
    console.log(logText);
    return runId;
  }

  private async process(fileId: string) {
    if (!this.ffmpegBusyMap[fileId]) {
      this.ffmpegBusyMap[fileId] = true;
      if (this.runPipelineMap[fileId].length > 0) {
        const runTask = this.runPipelineMap[fileId].pop();
        await this.ffmpegMap[fileId].run.call(runTask.command.split(' '));
        const logList = this.ffmpegLogMap[fileId];
        this.ffmpegLogMap[fileId] = [];
        this.ffmpegLogResponseMap[runTask.id] = logList;
        this.doneRunPipelineMap[runTask.id] = true;
        this.ffmpegBusyMap[fileId] = false;
        this.process(fileId);
      }
    }
  }

  private waitRunFinish(runId: string): Promise<LogData[]> {
    return new Promise<LogData[]>((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.doneRunPipelineMap[runId]) {
          clearInterval(interval);
          const logs = this.ffmpegLogResponseMap[runId];
          delete this.ffmpegLogResponseMap[runId];
          delete this.doneRunPipelineMap[runId];
          resolve(logs);
        }
      }, 50);
    })
    
  }

  // get frame: ffmpeg -ss 00:00:05.01 -i myvideo.avi -frames:v 1 myimage.jpg

}
