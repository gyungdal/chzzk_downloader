import Chzzk from "./chzzk";

const daemon = new Chzzk(process.argv[2], process.argv[3]);
daemon.start();

function handle(signal: number) {
  console.log(`Received ${signal}`);
  daemon.kill();
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);
// process.on("SIGKILL", handle);
