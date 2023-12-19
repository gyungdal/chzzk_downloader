export default class StreamerStatus {
  id: string;
  name: string;
  status: "OFFLINE" | "ONLINE";
  record: "WAIT" | "PROCESSING";

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.status = "OFFLINE";
    this.record = "WAIT";
  }
}
