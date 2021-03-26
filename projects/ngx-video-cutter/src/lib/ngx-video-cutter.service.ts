import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';

interface RunTask {
  id: string;
  command: string;
  dataTarget?: string;
  uniqueKey?: string;
}

interface RunTaskResponse {
  logs: LogData[];
  data?: Uint8Array;
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
  runCache: { [fileId: string]: { [command: string]: string } } = {};
  doneRunPipelineMap: { [runId: string]: boolean } = {};

  ffmpegLogMap: { [fileId: string]: LogData[] } = {};
  ffmpegLogResponseMap: { [runId: string]: LogData[] } = {};
  ffmpegDataResponseMap: { [runId: string]: Uint8Array } = {};

  constructor() {
    setInterval(() => {
      const fileIds = Object.keys(this.runPipelineMap);
      for (const fileId of fileIds) {
        this.process(fileId);
      }
    }, 1);
  }

  async openFile(videoFile: File): Promise<string> {
    const fileId = this.generateId();
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

  async getFrame(fileId: string, time: number, uniqueKey: string) {
    const res = await this.run(fileId, '-i video.mp4 -ss ' + this.millisecondsToString(time) + ' -frames:v 1 frame.png', 'frame.png', uniqueKey);
    const blob = new Blob([res.data]);
    return URL.createObjectURL(blob);;
  }

  async getDuration(fileId: string) {
    const res = await this.run(fileId, '-i video.mp4 -f null');
    let durationLog: LogData;
    for (const log of res.logs) {
      if (log.message.includes('Duration')) {
        durationLog = log;
      }
    }
    const time = durationLog.message.replace(/\s+/g, '').split('Duration:').pop().split(',start:')[0];
    const timeParts = time.split('.');
    const milliseconds = parseInt(timeParts.pop());
    const timePartsAux = timeParts.pop().split(':');
    const hours = parseInt(timePartsAux[0]);
    const minutes = parseInt(timePartsAux[1]);
    const seconds = parseInt(timePartsAux[2]);
    return milliseconds + (seconds * 1000) + (minutes * 60000) + (hours * 3600000);
  }

  async trim(fileId: string, start: number, end: number) {
    const startStr = this.millisecondsToString(start);
    const endStr = this.millisecondsToString(end);
    const res = await this.run(fileId, '-i video.mp4 -ss ' + startStr + ' -t ' + endStr + ' cut.mp4', 'cut.mp4');
    return new Blob([res.data]);
  }

  async showHelp(fileId: string) {
    const logs = await this.run(fileId, '-h');
  }

  private async run(fileId: string, command: string, dataTarget?: string, uniqueKey?: string): Promise<RunTaskResponse> {
    if (!this.runCache[fileId]) {
      this.runCache[fileId] = {};
    };
    if (this.runCache[fileId][command]) {
      return await this.waitRunFinish(this.runCache[fileId][command]);
    }
    if (uniqueKey) {
      this.updateUniqueCommand(fileId, uniqueKey, command, dataTarget);
    }
    const runId = this.generateId();
    this.runCache[fileId][command] = runId;
    this.runPipelineMap[fileId].push({ id: runId, command, dataTarget });
    const reponse = await this.waitRunFinish(runId);
    return reponse;
  }

  updateUniqueCommand(fileId: string, uniqueKey: string, command: string, dataTarget: string) {
    for (const i in this.runPipelineMap[fileId]) {
      if (this.runPipelineMap[fileId][i].uniqueKey === uniqueKey) {
        this.runPipelineMap[fileId][i].command = command;
        this.runPipelineMap[fileId][i].dataTarget = dataTarget;
      }
      break;
    }
  }

  private async process(fileId: string) {
    if (!this.ffmpegBusyMap[fileId]) {
      if (this.runPipelineMap[fileId].length > 0) {
        this.ffmpegBusyMap[fileId] = true;
        const runTask = this.runPipelineMap[fileId].pop();
        console.log('run', runTask.command, this.runPipelineMap[fileId]);
        await this.ffmpegMap[fileId].run.apply(runTask.command.split(' '), runTask.command.split(' '));
        console.log('run done');
        this.ffmpegLogResponseMap[runTask.id] = this.ffmpegLogMap[fileId];
        if (runTask.dataTarget) {
          this.ffmpegDataResponseMap[runTask.id] = this.ffmpegMap[fileId].FS('readFile', runTask.dataTarget);
        }
        this.ffmpegLogMap[fileId] = [];
        this.doneRunPipelineMap[runTask.id] = true;
        this.ffmpegBusyMap[fileId] = false;
      }
    }
  }

  private waitRunFinish(runId: string): Promise<RunTaskResponse> {
    return new Promise<RunTaskResponse>((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.doneRunPipelineMap[runId]) {
          clearInterval(interval);
          const logs = this.ffmpegLogResponseMap[runId];
          const data = this.ffmpegDataResponseMap[runId];
          // delete this.ffmpegLogResponseMap[runId];
          // delete this.doneRunPipelineMap[runId];
          resolve({
            logs,
            data
          });
        }
      }, 1);
    })

  }

  private uInt8ArrayToBase64(u8a: Uint8Array): string {
    const u8aStr = String.fromCharCode.apply(null, u8a);
    return btoa(u8aStr);
  }

  private generateId(): string {
    return (new Date()).getTime().toString() + this.uuidv4();
  }

  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private millisecondsToString(duration: number): string {
    let milliseconds = parseInt(((duration % 1000) / 100).toString());
    let seconds: string | number = Math.floor((duration / 1000) % 60);
    let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
    let hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

}
