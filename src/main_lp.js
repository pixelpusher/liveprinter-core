import { LivePrinter } from "../lib/main";


async function init() {
    const lp = new LivePrinter("UM2plus");
    console.info(`BPM 140: ${lp.bpm(140)}`);
    console.info(`travel speed A3: ${lp.tsp("A3")}`);
    
    console.info(`position: ${lp.x},${lp.y},${lp.z}`);
    await lp.mov2({x:40, y:4, z:0.18});   
    console.info(`new position: ${lp.x},${lp.y},${lp.z}`);

    console.info(`speed of a5: ${lp.midi2speed('a5')}`);

    console.info(`extrude at A5`);
    await lp.ext2({x:50, y:30, z:0.18, speed:'a5'});
    console.log(`new position: ${lp.x}, ${lp.y}, ${lp.z}`);
    console.log(`speed: ${lp.psp()}`);


    
    // test delay

    // test main loop, pause and break

}

init();
