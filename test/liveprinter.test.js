import { describe, it, expect, beforeEach } from 'vitest';
import { LivePrinter } from '../js/liveprinter';

describe('LivePrinter Core', () => {
  let lp;

  beforeEach(() => {
    lp = new LivePrinter("UM2plus");
  });

  it('should move the printer by x, y, z and get the result by listening for the printEvent', async () => {
    let eventFired = false;
    let lastEvent = null;

    lp.addPrintListener({
      printEvent: (event) => {
        if (event.type === 'travel' || event.type === 'extrude') {
          eventFired = true;
          lastEvent = event;
        }
      }
    });

    // Give it speed to guarantee it calculates actual physical travel rather than a wait op
    lp.travelspeed(100);
    await lp.move({ x: 10, y: 20, z: 5, speed: 100 });

    expect(eventFired).toBe(true);
    expect(lastEvent).toBeDefined();
    
    expect(lastEvent.newPosition.x).toBeCloseTo(10);
    expect(lastEvent.newPosition.y).toBeCloseTo(20);
    expect(lastEvent.newPosition.z).toBeCloseTo(5);
    
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

});