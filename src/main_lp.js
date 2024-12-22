import { LivePrinter } from "../lib/main";

const lp = new LivePrinter();

async function init() {
    lp.tsp(50); 
    await printer.mov2({x:40, y:4, z:0.18});   
}

init();
