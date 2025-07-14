import { LivePrinter } from "../lib/main";
import "./main.css";

const output = document.getElementById("output");
let index = 1;

function log(msg) {
  output.innerHTML += `<span class='log'>${msg}</span><br>\n`;
  console.log(msg);
}

function info(msg) {
  output.innerHTML += `<span class='index'>${index++}:</span>&nbsp;<span class='info'>${msg}</span><br>\n`;
  console.info(msg);
}

async function init() {
  const lp = new LivePrinter("UM2plus");

  const eventHandler = {
    printEvent: (event) => {
      if (event.type === "drawtime-start") {
        log(
          `drawtime-start: speed=${event.speed}, start=${event.start}, end=${event.end}`
        );
      } else if (event.type === "drawtime-end") {
        log(
          `drawtime-end: speed=${event.speed}, start=${event.start}, end=${event.end}`
        );
      }
      if (event.type === "traveltime-start") {
        log(
          `traveltime-start: speed=${event.speed}, start=${event.start}, end=${event.end}`
        );
      } else if (event.type === "traveltime-end") {
        log(
          `traveltime-end: speed=${event.speed}, start=${event.start}, end=${event.end}`
        );
      } else if (event.type === "travel-start") {
        log(
          `travel-start: x=${event.x}, y=${event.y}, z=${event.z}, speed=${event.speed}`
        );
      } else if (event.type === "travel-end") {
        log(
          `travel-end: x=${event.x}, y=${event.y}, z=${event.z}, speed=${event.speed}`
        );
      } else if (event.type === "draw-start") {
        log(
          `draw-start: x=${event.x}, y=${event.y}, z=${event.z}, speed=${event.speed}`
        );
      } else if (event.type === "draw-end") {
        log(
          `draw-end: x=${event.x}, y=${event.y}, z=${event.z}, speed=${event.speed}`
        );
      } else if (event.type === "wait-start") {
        log(`wait-start: time=${event.time} :: current time=${lp.time}`);
      } else if (event.type === "wait-end") {
        log(`wait-end: time=${event.time} :: current time=${lp.time}`);
      } else if (event.type === "retract") {
        log(`retract: speed=${event.speed}, length=${event.length}`);
      } else if (event.type === "unretract") {
        log(`unretract: speed=${event.speed}, length=${event.length}`);
      } else if (event.type === "extrude") {
        log(
          `extrude: x=${event.x}, y=${event.y}, z=${event.z}, speed=${event.speed}`
        );
      }
    },
  };

  lp.addPrintListener(eventHandler);

  info(`BPM 140: ${lp.bpm(140)}`);
  info(`travel speed A3: ${lp.tsp("A3")}`);

  info(`travel speed A#3: ${lp.tsp("A#3")}`);

  info(`position: ${lp.x},${lp.y},${lp.z}\n`);
  await lp.mov2({ x: 40, y: 4, z: 0.18, speed: 40 });
  info(`new position: ${lp.x},${lp.y},${lp.z}`);

  info(`speed of a5: ${lp.midi2speed("a5")}`);

  info(`extrude at A5`);
  await lp.ext2({ x: 50, y: 30, z: 0.18, speed: "a5" });
  log(`new position: ${lp.x}, ${lp.y}, ${lp.z}`);

  log(`speed: ${lp.psp()} (not set by extrude!)`);
  lp.bpm(120);
  log(`speed: ${lp.psp("a5")} (a5 at 120bpm)`);

  log(`extrude at sound of 200hz`);
  log(`speed: ${lp.psp("200hz")}`);

  info(`Dimension or time 2b ${lp.parseAsDimensionOrTime("2b")}`);
  info(`Dimension or time 1.5b ${lp.parseAsDimensionOrTime("1.5b")}`);
  info(`Dimension or time 1 1/2b ${lp.parseAsDimensionOrTime("1 1/2b")}`);

  info(`Dimension or time 30mm ${lp.parseAsDimensionOrTime("30mm")}`);
  info(`Dimension or time 30cm ${lp.parseAsDimensionOrTime("30cm")}`);
  info(`Dimension or time 30 ${lp.parseAsDimensionOrTime("30")}`);

  info(`extrude at 1 beats at 140bpm`);
  lp.bpm(140);
  await lp.ext({ x: "1b", speed: "440hz" });
  log(`new position: ${lp.x}, ${lp.y}, ${lp.z}`);
  log(`speed: ${lp.psp()}`);

  // test wait
  info(`wait 1 beat`);
  await lp.wait("1b");
  log(`new position (same?): ${lp.x}, ${lp.y}, ${lp.z}`);

  // test speed 0
  info(`set speed to 0`);
  lp.speed(0);
  log(`speed: ${lp.psp()}`);
  info(`drawtime 1b with speed 0 (should wait)`);
  await lp.drawtime("1b");
  log(`new position (same?): ${lp.x}, ${lp.y}, ${lp.z}`);

  log(`travel speed: ${lp.tsp()}`);
  info(`traveltime 1b with speed 0 (should wait)`);
  await lp.traveltime("1b");
  log(`new position (same?): ${lp.x}, ${lp.y}, ${lp.z}`);

  // test main loop, pause and break
}

init();
