interface LivePollingStatus {
  status: string; //"STARTED";
  isPublishing: boolean; //true;
  playableStatus: string; //"PLAYABLE",;
  trafficThrottling: number;
  callPeriodMilliSecond: number;
}

interface LiveStatusContent {
  liveTitle: string;
  status: string; //"OPEN";
  concurrentUserCount: number;
  accumulateCount: number;
  paidPromotion: boolean;
  adult: boolean;
  chatChannelId: string;
  categoryType?: number;
  liveCategory: string;
  liveCategoryValue: string;
  livePollingStatusJson: string; //"{\"status\": \"STARTED\", \"isPublishing\": true, \"playableStatus\": \"PLAYABLE\", \"trafficThrottling\": -1, \"callPeriodMilliSecond\": 10000}";
  faultStatus?: any;
}

interface LiveDetailMetaCdnInfo {
  cdnType: string;
  zeroRating: boolean;
}

interface LiveDetailMeta {
  videoId: string;
  streamSeq: number;
  liveId: string;
  paidLive: boolean;
  cdnInfo: LiveDetailMetaCdnInfo;
  p2p: boolean;
}

interface LiveDetailServiceMeta {
  contentType: string;
}

interface LiveDetailThumbnail {
  snapshotThumbnailTemplate: string; // "https://livecloud-thumb.akamaized.net/chzzk/livecloud/KR/stream/26441774/live/4141757/record/24029987/thumbnail/image_{type}.jpg",
  types: string[]; // ["1080", "720", "480", "360", "270", "144"]
}

interface LiveDetailLive {
  start?: Date;
  open?: Date;
  timeMachine: boolean;
  status: string; //"STARTED"
}

interface LiveDetailApi {
  name: string; //"watching", "waiting", "p2p-config", "qoeConfig"
  path: string;
}

interface LiveDetailMedia {
  mediaId: string;
  protocol: string;
  path: string;
}

interface LiveDetailPlayback {
  meta: LiveDetailMeta;
  serviceMeta: LiveDetailServiceMeta;
  thumbnail: LiveDetailThumbnail;
  live: LiveDetailLive;
  api: LiveDetailApi[];
  media: LiveDetailMedia[];
  //"multiview": []
}

interface LiveChannel {
  channelId: string;
  channelName: string;
  channelImageUrl: string;
  verifiedMark: boolean;
}
interface LiveDetailContent
  extends Omit<LiveStatusContent, "adult" | "faultStatus"> {
  liveId: number;
  liveImageUrl: string;
  defaultThumbnailImageUrl?: string;
  openDate?: Date;
  closeDate?: Date;
  chatActive: boolean;
  chatAvailableGroup: string; //"ALL",
  chatAvailableCondition: string; // "NONE",
  minFollowerMinute: number; //0,
  livePlaybackJson: string;
  channel: LiveChannel;
}

interface ChzzkResponse<T> {
  code: number;
  message?: string;
  content: T;
}
export {
  ChzzkResponse,
  LiveDetailContent,
  LiveStatusContent,
  LiveDetailPlayback,
  LivePollingStatus,
};
