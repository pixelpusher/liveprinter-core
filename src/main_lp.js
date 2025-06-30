import { LivePrinter } from "../lib/main";


async function init() {
    const lp = new LivePrinter("UM2plus");
    console.info(`BPM 140: ${lp.bpm(140)}`);
    console.info(`travel speed A3: ${lp.tsp("A3")}`);
    
    console.info(`position: ${lp.x},${lp.y},${lp.z}`);
    await lp.mov2({x:40, y:4, z:0.18, speed:40});   
    console.info(`new position: ${lp.x},${lp.y},${lp.z}`);

    console.info(`speed of a5: ${lp.midi2speed('a5')}`);

    console.info(`extrude at A5`);
    await lp.ext2({x:50, y:30, z:0.18, speed:'a5'});
    console.log(`new position: ${lp.x}, ${lp.y}, ${lp.z}`);

    console.log(`speed: ${lp.psp()} (not set by extrude!)`);
    lp.bpm(120);
    console.log(`speed: ${lp.psp('a5')} (a5 at 120bpm)`);

    console.log(`extrude at sound of 200hz`);
    console.log(`speed: ${lp.psp('200hz')}`);


    console.info(`Dimension or time 2b ${lp.parseAsDimensionOrTime('2b')}`);
    console.info(`Dimension or time 1.5b ${lp.parseAsDimensionOrTime('1.5b')}`);
    console.info(`Dimension or time 1 1/2b ${lp.parseAsDimensionOrTime('1 1/2b')}`);

    console.info(`Dimension or time 30mm ${lp.parseAsDimensionOrTime('30mm')}`);
    console.info(`Dimension or time 30cm ${lp.parseAsDimensionOrTime('30cm')}`);
    console.info(`Dimension or time 30 ${lp.parseAsDimensionOrTime('30')}`);
    

    console.info(`extrude at 1 beats at 140bpm`);
    lp.bpm(140);
    await lp.ext({x:'1b', speed:'440hz'});
    console.log(`new position: ${lp.x}, ${lp.y}, ${lp.z}`);
    console.log(`speed: ${lp.psp()}`);

    
    // test delay

    // test main loop, pause and break

}

init();
