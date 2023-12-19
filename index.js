const download = require("node-hls-downloader").download;

download({
  quality: "best",
  concurrency: 5,
  outputFile: "video.mp4",
  streamUrl:
    "https://livecloud.pstatic.net/chzzk/lip2_kr/pgsg1nmss2u0001/5pw4zncgytyrbw8w9neui1ga56s5w2ewox/hls_playlist.m3u8?hdnts=st=1702958204~exp=1702990614~acl=*/5pw4zncgytyrbw8w9neui1ga56s5w2ewox/*~hmac=43a4c355bc3086ac79f3dac920c5cc626ae1abb156780d3d92df4808233b2570",
});
