import { describe, it, expect, beforeEach } from 'vitest';
import { LivePrinter } from '../js/liveprinter';

describe('LivePrinter Core', () => {
  let lp;
  let printerEventHandler = {
      eventFired: false,
      lastEvent: null,
      printEvent: function (event) {
        if (event.type === 'move-start' || event.type === 'extrude-start') {
          this.eventFired = true;
          this.lastEvent = event;
        }
      }
    };

  beforeEach(() => {
    lp = new LivePrinter("UM2plus");
  });

  it('should move the printer by x, y, z and get the result by listening for the printEvent', async () => {
    printerEventHandler.eventFired = false;
    printerEventHandler.lastEvent = null;

    // add new each time
    lp.addPrintListener(printerEventHandler);

    // Give it speed to guarantee it calculates actual physical travel rather than a wait op
    lp.travelspeed(100);
    await lp.move({ x: 10, y: 20, z: 5, speed: 100 });

    expect(printerEventHandler.eventFired).toBe(true);
    expect(printerEventHandler.lastEvent).toBeDefined();
    
    expect(printerEventHandler.lastEvent.newPosition.x).toBeCloseTo(10);
    expect(printerEventHandler.lastEvent.newPosition.y).toBeCloseTo(20);
    expect(printerEventHandler.lastEvent.newPosition.z).toBeCloseTo(5);
    
    expect(lp.x).toBeCloseTo(10);
    expect(lp.y).toBeCloseTo(20);
    expect(lp.z).toBeCloseTo(5);
  });

  describe('main_lp.js functionality', () => {
    it('should correctly configure speeds, parsing inputs, and track relative/absolute moves', async () => {
      // BPM tests
      expect(lp.bpm(140)).toBe(140);
      expect(lp._bpm).toBe(140);

      // Travel speeds based on Pitch/MIDI
      const speedA3 = lp.tsp("A3");
      expect(speedA3).toBeGreaterThan(0);

      const speedASharp3 = lp.tsp("A#3");
      expect(speedASharp3).toBeGreaterThan(speedA3); // Should increase per note frequency

      // Absolute Position & Movements
      expect(lp.x).toBe(0);
      expect(lp.y).toBe(0);
      expect(lp.z).toBe(0);

      await lp.mov2({ x: 40, y: 4, z: 0.18, speed: 40 });
      expect(lp.x).toBe(40);
      expect(lp.y).toBe(4);
      expect(lp.z).toBe(0.18);

      // Extrusion handling mapped to sound frequency
      const speedA5 = lp.midi2speed("a5");
      expect(speedA5).toBeGreaterThan(0);

      await lp.ext2({ x: 50, y: 30, z: 0.18, speed: "a5" });
      expect(lp.x).toBe(50);
      expect(lp.y).toBe(30);

      // Speed state caching checks
      lp.bpm(120);
      expect(lp.psp("a5")).toBeGreaterThan(0);
      expect(lp.psp("200hz")).toBeGreaterThan(0);

      // Validating dimension vs time notation parsing
      expect(lp.parseAsDimensionOrTime("2b")).toBeTypeOf("number");
      expect(lp.parseAsDimensionOrTime("1.5b")).toBeTypeOf("number");
      expect(lp.parseAsDimensionOrTime("1 1/2b")).toBeTypeOf("number");
      expect(lp.parseAsDimensionOrTime("30mm")).toBe(30);
      expect(lp.parseAsDimensionOrTime("30cm")).toBe(300);
      expect(lp.parseAsDimensionOrTime("30")).toBe(30);

      // Time-scaled operations
      lp.bpm(140);
      const currentX = lp.x;
      await lp.ext({ x: "1b", speed: "440hz" });
      expect(lp.x).toBeGreaterThan(currentX); // X moved based on 1 beat time length

      // Blocking time actions without speed wait
      lp.speed(0);
      expect(lp.psp()).toBe(0);
      
      const waitTimeStart = lp.time;
      await lp.wait("1b");
      expect(lp.time).toBeGreaterThan(waitTimeStart);

      const drawTimeStart = lp.time;
      await lp.drawtime("1b"); // Should act like wait
      expect(lp.time).toBeGreaterThan(drawTimeStart);

      const travelTimeStart = lp.time;
      await lp.traveltime("1b"); // Should act like wait
      expect(lp.time).toBeGreaterThan(travelTimeStart);
    });
  });

  describe('drawfill() single draw check', () => {
    it('should draw a simple line when gap width exceeds the space and finish exactly h mm away with same heading', async () => {
      // Put it in the center so we don't accidentally clip out of bounds when drawing
      lp.x = lp.cx;
      lp.y = lp.cy;
      lp.z = 10;
      lp.speed(100);
      
      const startHeading = 45;
      lp.turnto(startHeading);
      
      const startX = lp.x;
      const startY = lp.y;
      const startZ = lp.z;
      const startAngle = lp.angle;
      let targetH = 20;
      
      // When times = (_h / _gap) / 2 is strictly < 1 it executes a simple `this.draw(h)` inline length draw.
      // By providing an hgap > targetH * 2 (e.g. 50), times is (20/50)/2 = 0.2 < 1.
      await lp.drawfill({ w: 10, h: targetH, hgap: 50 });
      
      const distX = lp.x - startX;
      const distY = lp.y - startY;
      const distZ = lp.z - startZ;
      const totalDistance = Math.sqrt(distX * distX + distY * distY + distZ * distZ);
      
      expect(totalDistance).toBeCloseTo(targetH);
      expect(lp.angle).toBeCloseTo(startAngle); // Orientation must remain unaffected
    });
  });

describe('drawfill() robust check', () => {
    it('should draw a wiggly line of length h with a width w and a gap width and finish exactly h mm away with same heading', async () => {
      // Put it in the center so we don't accidentally clip out of bounds when drawing
      lp.x = lp.cx;
      lp.y = lp.cy;
      lp.z = 0.2;
      lp.speed(100);
      
      const startHeading = 45;
      lp.turnto(startHeading);
      
      const startX = lp.x;
      const startY = lp.y;
      const startZ = lp.z;
      const startAngle = lp.angle;
      let targetH = 60;
      
      // When times = (_h / _gap) / 2 is strictly < 1 it executes a simple `this.draw(h)` inline length draw.
      // By providing an hgap > targetH * 2 (e.g. 50), times is (20/50)/2 = 0.2 < 1.
      await lp.drawfill({ w: 10, h: targetH, hgap: 5 });
      
      const distX = lp.x - startX;
      const distY = lp.y - startY;
      const distZ = lp.z - startZ;
      const totalDistance = Math.sqrt(distX * distX + distY * distY + distZ * distZ);
      
      expect(totalDistance).toBeCloseTo(targetH);
      expect(lp.angle).toBeCloseTo(startAngle); // Orientation must remain unaffected
    });
  });

  describe("elevation, elev, and calcElevation", () => {
    it("should set elevation directly using elevation() and elev()", () => {
      lp.elevation(45);
      expect(lp._elevation).toBeCloseTo(Math.PI / 4);

      lp.elev(30);
      expect(lp._elevation).toBeCloseTo(Math.PI / 6);

      lp.elevation(Math.PI / 2, true); // radians
      expect(lp._elevation).toBeCloseTo(Math.PI / 2);
    });

    it("should calculate elevation using calcElevation()", () => {
      lp.layerHeight = 0.2;
      lp.bpm(120); // 1 beat = 500ms

      // speed 100mm/s, time 1 beat (0.5s) -> distance = 50mm
      // lh = 0.2, d = 50
      // angle = atan2(0.2, 50) 
      let angle = lp.calcElevation("1b",100);
      let expectedAngle = Math.atan2(0.2, 50);
      expect(angle).toBeCloseTo(expectedAngle);

      lp.layerHeight = 0.2;
      lp.bpm(120); // 1 beat = 500ms

      // speed 100mm/s, time 1 beat (0.5s) -> distance = 50mm
      // lh = 0.2, d = 50
      // angle = atan2(0.2, 50) in degrees
       angle = lp.calcElevation("2b",10);
       expectedAngle = Math.atan2(0.2, 10);
      expect(angle).toBeCloseTo(expectedAngle);

    });

    it("should calculate elevation using elev()", () => {
      lp.layerHeight = 0.2;
      lp.bpm(120); // 1 beat = 500ms, 2b = 1s
      lp.speed(10); //10mm/s

      // speed 10mm/s, time 2 beat (1s) -> distance = 10mm
      const angle = lp.elev({time:"2b", speed: 10});
      const expectedAngle = Math.atan2(0.2, 10);
      expect(angle).toBeCloseTo(expectedAngle);
    });

    it("should use calculated elevation in a draw operation (simple)", async () => {
      lp.lh = 0.2; // 0.2mm
      lp.speed(10); //10mm/s
      lp.bpm(120); // 1 beat = 500ms 
      lp.interval('1/8b');
      const drawTime = '1b';
      const horizontal_d = lp.t2mm(drawTime);
      const angle = lp.calcElevation(drawTime); // speed 10mm/s, in degrees not radians
      lp.elevation(angle, true); // degrees by default
      const startZ = lp.z;
      await lp.draw(horizontal_d);
      expect(lp.z - startZ).toBeCloseTo(lp.lh);
    });
    
    it("should use calculated elevation in a draw operation (object args)", async () => {
      const lh = 1;
      const bpm = 123;
      const speed = 'a5';
      const time = '1/2b';
      
      // Set properties on the printer instance
      lp.speed(speed);
      lp.bpm(bpm);
      lp.lh = lh;
      lp.interval('1/16b');

      // Calculate the distance that corresponds to the given time and speed
      const d = lp.t2mm(time, speed, bpm);

      // Calculate the required elevation angle using the object-based `elev` call
      const angle = lp.elev({time, speed, bpm, lh}); 
      lp.elevation(angle, true); // Set the calculated angle

      const startZ = lp.z;
      const startX = lp.x;
      const startY = lp.y;

      
      // Use draw() with the total 3D distance to perform the move.
      await lp.drawtime(time);

      expect(lp.x - startX).toBeCloseTo(d * Math.cos(angle));
      expect(lp.y - startY).toBeCloseTo(0);
      expect(lp.z - startZ).toBeCloseTo(d * Math.sin(angle));
    });

 it("should use calculated elevation in a draw operation (object args shorthand version)", async () => {
      const lh = 0.4;
      const bpm = 123;
      const speed = 'a8';
      const time = '1/2b';
      
      // Set properties on the printer instance
      lp.speed(speed);
      lp.bpm(bpm);
      lp.lh = lh;

      // Calculate the horizontal distance that corresponds to the given time and speed
      const d = lp.t2mm(time, speed, bpm);

      // Calculate the required elevation angle using the object-based `elev` call
      const angle = lp.elev({t:time, s:speed, bpm, lh}); 
      lp.elevation(angle, true); // Set the calculated angle

      const startZ = lp.z;
      const startX = lp.x;
      const startY = lp.y;

      // Use draw() with the total 3D distance to perform the move.
      await lp.draw(d);

      expect(lp.x - startX).toBeCloseTo(d);
      expect(lp.y - startY).toBeCloseTo(0); // No Y movement with default heading
      expect(lp.z - startZ).toBeCloseTo(lp.lh);
    });

  });

  describe("parseAsTime", () => {
    it("should correctly parse seconds to milliseconds", () => {
      expect(lp.parseAsTime("1s")).toBeCloseTo(1000);
      expect(lp.parseAsTime("0.5s")).toBeCloseTo(500);
      expect(lp.parseAsTime("2s")).toBeCloseTo(2000);
      expect(lp.parseAsTime("0.1s")).toBeCloseTo(100);
    });

    it("should correctly parse beats to milliseconds", () => {
      lp.bpm(120); // 1 beat = 500ms
      expect(lp.parseAsTime("1b")).toBeCloseTo(500);
      expect(lp.parseAsTime("1/2b")).toBeCloseTo(250);
      expect(lp.parseAsTime("2b")).toBeCloseTo(1000);
    });

    it("should pass through milliseconds unchanged", () => {
      expect(lp.parseAsTime("100ms")).toBeCloseTo(100);
      expect(lp.parseAsTime("500ms")).toBeCloseTo(500);
    });
  });

  describe("drawtime e-property updates", () => {
    it("should update e on every drawtime call in a basic series", async () => {
      lp.bpm(123);
      lp.speed('a4');
      lp.lh = 1;
      lp.interval('1/16b');

      for (let i = 0; i < 200; i++) {
        const prevE = lp.e;
        await lp.drawtime('1/16b');
        expect(lp.e - prevE).toBeGreaterThan(0);
      }
    });

    it("should update e on every drawtime call with turns", async () => {
      lp.bpm(120);
      lp.speed('c6');
      lp.lh = 0.2;
      lp.x = lp.cx;
      lp.y = lp.cy;
      lp.z = 1;

      for (let i = 0; i < 200; i++) {
        const prevE = lp.e;
        await lp.drawtime('2b'); lp.turn(90);
        expect(lp.e - prevE).toBeGreaterThan(0);
      }
    });

    it("should update e even when position is clipped to printer bounds", async () => {
      lp.bpm(120);
      lp.speed('e5');
      lp.lh = 0.2;
      lp.x = lp.maxx - 5;
      lp.y = lp.maxy - 5;
      lp.z = 1;

      for (let i = 0; i < 200; i++) {
        const prevE = lp.e;
        await lp.drawtime('1b');
        expect(lp.e - prevE).toBeGreaterThan(0);
      }
    });

    it("should update e after interleaved drawtime and traveltime calls", async () => {
      lp.bpm(120);
      lp.speed(20);
      lp.lh = 0.2;
      lp.travelspeed(40);

      for (let i = 0; i < 200; i++) {
        const prevE = lp.e;
        await lp.drawtime('1/2b'); lp.turn(180);
        expect(lp.e - prevE).toBeGreaterThan(0);
        await lp.traveltime('1/4b'); lp.turn(180);
        lp.turn(45);
      }
    });

    it("should update e with elevation set across multiple calls", async () => {
      lp.bpm(123);
      lp.speed('a5');
      lp.lh = 1;
      lp.interval('1/16b');

      for (let i = 0; i < 200; i++) {
        const angle = lp.elev({time:'2b'});
        lp.elevation(angle, true);
        const prevE = lp.e;
        await lp.drawtime('1/2b'); lp.turn(90);
        expect(lp.e - prevE).toBeGreaterThan(0);
        lp.turn(90);
      }
    });

    it("should update e consistently with seconds notation", async () => {
      lp.bpm(120);
      lp.speed(20);
      lp.lh = 0.2;

      for (let i = 0; i < 50; i++) {
        const prevE = lp.e;
        await lp.drawtime("0.5s"); lp.turn(90);
        expect(lp.e - prevE).toBeGreaterThan(0);
      }
    });

    it("should update e when mixed with retract etc.", async () => {
      lp.bpm(120);
      lp.speed('e5');
      lp.lh = 0.2;
      lp.x = lp.cx;
      lp.y = lp.cy;
      lp.z = 0.2;

      for (let i = 0; i < 20; i++) {
        let prevE = lp.e;
        await lp.drawtime('2b'); lp.turn(180);
        expect(lp.e - prevE).toBeGreaterThan(0);
        await lp.retract();
        await lp.unretract();
        lp.turn(30+30*Math.random());
        prevE = lp.e;
        await lp.drawtime('1b'); 
        lp.turn(30+30*Math.random());
        expect(lp.e - prevE).toBeGreaterThan(0);
      }

    });
  });



  describe("drawtime/traveltime time accuracy", () => {
    it("should not overshoot targetTime when interval does not divide evenly into draw time", async () => {
      lp.bpm(120);
      lp.speed(10);
      lp.lh = 0.2;
      lp.interval('1/3b'); // 166.67ms interval

      // drawtime('3/4b') = 375ms. 375/166.67 = 2.25 steps.
      // Final step should only move remaining ~41.67ms, not a full 166.67ms.
      const startTime = lp.totalMoveTime;
      await lp.drawtime('3/4b');
      const elapsed = lp.totalMoveTime - startTime;
      const expected = lp.parseAsTime('3/4b');

      expect(elapsed).toBeCloseTo(expected, 0);
    });

    it("traveltime should not overshoot targetTime either", async () => {
      lp.bpm(120);
      lp.travelspeed(10);
      lp.interval('1/3b');

      const startTime = lp.totalMoveTime;
      await lp.traveltime('3/4b'); lp.turn(90);
      const elapsed = lp.totalMoveTime - startTime;
      const expected = lp.parseAsTime('3/4b');

      expect(elapsed).toBeCloseTo(expected, 0);
    });
  });



});