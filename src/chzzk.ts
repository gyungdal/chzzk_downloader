import axios from "axios";
import { dirname, resolve } from "path";
import ffmpeg from "fluent-ffmpeg";
import {
  ChzzkResponse,
  LiveDetailContent,
  LiveDetailPlayback,
  LiveStatusContent,
} from "./response";
import StreamerStatus from "./status";
import { existsSync, mkdirSync, rmSync } from "fs";
export default class Chzzk {
  streamer: StreamerStatus;
  intervalId?: NodeJS.Timeout;

  constructor(id: string, name: string) {
    this.streamer = new StreamerStatus(id, name);
    this.intervalId = undefined;
  }

  endStream(name: string) {
    this.streamer.record = "WAIT";
    console.log("[Chzzk] file has been downloaded succesfully");
    const convertFilePath = name.replace(".mp4", "_h265.mp4");
    console.log("[Chzzk] file convert start");
    ffmpeg()
      .input(name)
      .addOptions(["-c:v libx265", "-crf 26", "-c:a aac"])
      .on("end", () => {
        console.log(`[Chzzk] file convert done : ${convertFilePath}`);
        console.log(`[Chzzk] remove original file : ${name}`);
        rmSync(name);
      })
      .saveToFile(convertFilePath);
  }
  errorStream(err: any) {
    this.streamer.record = "WAIT";
    console.log(`an error happened: ${err.message}`);
  }

  createFolder(folder: string) {
    const folderList: Array<string> = [];
    while (folder.length > 1) {
      folderList.push(dirname(folder));
      folder = dirname(folder);
    }
    for (const folderPath of folderList.reverse()) {
      if (existsSync(folderPath)) {
        continue;
      }
      console.log(`[Chzzk] Create Folder ${folderPath}`);
      mkdirSync(folderPath);
    }
  }

  download(url: string) {
    const now = new Date();

    const savedPath = resolve(
      __dirname,
      `storage`,
      `${now.toISOString()}_${this.streamer.name}`,
      `${now.toISOString()}_${this.streamer.name}.mp4`
    );
    this.createFolder(savedPath);

    console.log(`[Chzzk] Start download! save to ${savedPath}`);
    this.streamer.record = "PROCESSING";
    ffmpeg()
      .input(
        url // "https://livecloud.pstatic.net/chzzk/lip2_kr/pgsg1nmss2u0001/5pw4zncgytyrbw8w9neui1ga56s5w2ewox/hls_playlist.m3u8?hdnts=st=1702958204~exp=1702990614~acl=*/5pw4zncgytyrbw8w9neui1ga56s5w2ewox/*~hmac=43a4c355bc3086ac79f3dac920c5cc626ae1abb156780d3d92df4808233b2570"
      )
      .addOptions(["-c copy", "-bsf:a aac_adtstoasc"])
      .on("end", () => this.endStream(savedPath))
      .on("error", (err) => this.errorStream(err))
      .saveToFile(savedPath);
  }

  async check(): Promise<boolean> {
    const status = await axios.get<ChzzkResponse<LiveStatusContent>>(
      `https://api.chzzk.naver.com/polling/v1/channels/${this.streamer.id}/live-status`
    );
    if (status.data.content.status == "OPEN") {
      return true;
    }
    return false;
  }

  async getDetail(): Promise<ChzzkResponse<LiveDetailContent>> {
    const status = await axios.get<ChzzkResponse<LiveDetailContent>>(
      `https://api.chzzk.naver.com/service/v1/channels/${this.streamer.id}/live-detail`
    );
    return status.data;
  }

  async timerHandler() {
    if (this.streamer.record == "PROCESSING") return;
    const onlineCheck = await this.check();
    if (onlineCheck) {
      if (this.streamer.status == "OFFLINE") {
        console.log("[Chzzk] Streamer Online!");
        this.streamer.status = "ONLINE";
      }
    } else {
      if (this.streamer.status == "ONLINE") {
        this.streamer.status = "OFFLINE";
        console.log("[Chzzk] Streamer Offline!");
      }
    }

    if (this.streamer.status == "ONLINE") {
      if (this.streamer.record == "WAIT") {
        const detail = await this.getDetail();
        const livePlaybackJson: LiveDetailPlayback = JSON.parse(
          detail.content.livePlaybackJson
        );
        if (livePlaybackJson.live.status != "STARTED") {
          return;
        }
        const media = livePlaybackJson.media.find(
          (value) => value.mediaId == "HLS"
        );
        if (media) {
          this.download(media.path);
        }
      }
    }
  }

  start() {
    this.intervalId = setInterval(() => this.timerHandler(), 5000);
    console.log("[Chzzk] Start!");
  }

  kill() {
    console.log("[Chzzk] Kill Instance");
    if (this.intervalId) {
      console.log("[Chzzk] Clear Interval");
      clearInterval(this.intervalId);
    }
  }
}
