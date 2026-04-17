# LivePrinter Core Functions Reference

Complete documentation of all functions and methods in the LivePrinter library for interactive programming of CNC machines and 3D printers.

**Library**: LivePrinter Core v1.0  
**Main Class**: `LivePrinter`  
**Author**: Evan Raskob

## Table of Contents

1. [Constructor & Setup](#constructor--setup)
2. [Event Management](#event-management)
3. [Speed & Movement Settings](#speed--movement-settings)
4. [Printer Configuration](#printer-configuration)
5. [Temperature & Hardware Control](#temperature--hardware-control)
6. [Positioning & Movement](#positioning--movement)
7. [Drawing & Extrusion](#drawing--extrusion)
8. [Time-Based Movement](#time-based-movement)
9. [Parsing & Conversion](#parsing--conversion)
10. [Travel & Movement Warping](#travel--movement-warping)
11. [Shape Functions](#shape-functions)
12. [Path Printing](#path-printing)
13. [Utility & Loop Functions](#utility--loop-functions)
14. [Listener Management](#listener-management)

---

## Constructor & Setup

### `constructor(model = "UM2plus")`
Create a new LivePrinter instance with the specified printer model.

**Parameters:**
- `model` (String): Valid printer model from `printers.js` (e.g., "UM2plus", "UM3", "REPRAP")

**Returns:** LivePrinter instance

**Example:**
```javascript
const lp = new LivePrinter("UM2plus");
```

### `setProperties(model)`
Set default printer properties based on the selected model including bed size, speeds, and nozzle specifications.

**Parameters:**
- `model` (String): Valid model from `printers.js`

**Returns:** void

### `stop(state = true)`
Set flag for stopping all operations immediately.

**Parameters:**
- `state` (Boolean): `true` to stop, `false` to continue

**Returns:** void

---

## Event Management

### `async gcodeEvent(gcode)`
Notify all listeners that GCode is ready to be consumed.

**Parameters:**
- `gcode` (String): GCode command string to send

**Returns:** Promise that resolves when all listeners have been notified

**Example:**
```javascript
await lp.gcodeEvent("G28"); // Home all axes
```

### `async gcode(gc)`
Shorthand for `gcodeEvent()`. Notify listeners that GCode is ready.

**Parameters:**
- `gc` (String): GCode command string

**Returns:** Promise

### `async printEvent(eventData)`
Notify listeners that a printing operation happened.

**Parameters:**
- `eventData` (Object): Event data object with properties like:
  - `type` (String): Operation type ("travel", "extrude", "retract", "unretract", "draw-start", "draw-end", etc.)
  - `newPosition` (Object): New position after operation
  - `oldPosition` (Object): Position before operation
  - `speed` (Number): Movement speed in mm/s
  - `moveTime` (Number): Time for this movement in ms
  - `totalMoveTime` (Number): Cumulative movement time
  - `layerHeight` (Number): Current layer height
  - `length` (Number): Length of movement/extrusion

**Returns:** Promise

### `async errorEvent(err)`
Notify listeners that an error has occurred.

**Parameters:**
- `err` (Error): Error object to report

**Returns:** Promise

---

## Speed & Movement Settings

### `printspeed(s)`
Get or set the printing speed (extrusion movement speed).

**Parameters:**
- `s` (Number, optional): Speed in mm/s. If provided, sets the speed; otherwise returns current speed.

**Returns:** (Number) Current printing speed in mm/s

**Example:**
```javascript
lp.printspeed(30); // Set print speed to 30 mm/s
const speed = lp.printspeed(); // Get current speed
```

### `psp(s)`
Shortcut for `printspeed()`.

**Parameters:**
- `s` (Number, optional): Speed in mm/s

**Returns:** (Number) Current printing speed in mm/s

### `drawspeed(s)`
Set printing speed for draw operations. Alias for consistency with "draw" naming.

**Parameters:**
- `s` (Number, optional): Speed in mm/s

**Returns:** (Number) Current drawing speed in mm/s

### `dsp(s)`
Shortcut for `drawspeed()`.

**Parameters:**
- `s` (Number, optional): Speed in mm/s

**Returns:** (Number) Current drawing speed in mm/s

### `travelspeed(s)`
Get or set the travel speed (non-extrusion movement speed).

**Parameters:**
- `s` (Number, optional): Speed in mm/s

**Returns:** (Number) Current travel speed in mm/s

### `tsp(s)`
Shortcut for `travelspeed()`.

**Parameters:**
- `s` (Number, optional): Speed in mm/s

**Returns:** (Number) Current travel speed in mm/s

### `speed(s)`
Set both travel and printing speeds at once.

**Parameters:**
- `s` (Number): Speed in mm/s

**Returns:** (Number) The speed value set

### `get maxspeed`
Get the maximum safe speed for the printer.

**Returns:** (Object) {x, y, z, e} max speeds in mm/s

---

## Printer Configuration

### `get/set model`
Get or set the printer model (which determines bed size, speeds, and other properties).

**Parameters (setter):**
- `m` (String): Valid model from `printers.js`

**Returns:** (String) Current printer model

**Example:**
```javascript
lp.model = "UM3";
const currentModel = lp.model;
```

### `async retractspeed(s)`
Get or set the filament retraction speed.

**Parameters:**
- `s` (Number, optional): Speed in mm/s. Updates the printer firmware if provided.

**Returns:** (Promise<Number>) Retraction speed in mm/s

### `get retractSpeed`
Get the current retraction speed (read-only).

**Returns:** (Number) Retraction speed in mm/s

### `thick(val)`
Set the extrusion thickness (layer height).

**Parameters:**
- `val` (Number): Thickness of the extruded line in mm

**Returns:** (LivePrinter) Reference to this object for chaining

### `set layerHeight(height)`
Set the layer height safely.

**Parameters:**
- `height` (Number): Layer height in mm

**Returns:** void

### `set lh(height)`
Shortcut for `layerHeight`.

**Parameters:**
- `height` (Number): Layer height in mm

**Returns:** void

### `get layerHeight` / `get lh`
Get the current layer height.

**Returns:** (Number) Current layer height in mm

### `autoretract(state = true)`
Enable or disable automatic filament retraction.

**Parameters:**
- `state` (Boolean): `true` for on, `false` for off

**Returns:** (Boolean) Current auto-retraction state

### `bpm(beats = this._bpm)`
Get or set the beats per minute for time-based movements.

**Parameters:**
- `beats` (Number, optional): BPM value

**Returns:** (Number) Current BPM

### `bps(beats)`
Get or set beats per second for time-based movements.

**Parameters:**
- `beats` (Number, optional): Beats per second

**Returns:** (Number) Current BPS

### `interval(time)`
Set minimum movement time interval for printer movements, used in `drawtime()` for calculating time-based movements.

**Parameters:**
- `time` (Number or String): Time interval (e.g., "1/4b" for quarter beat, "20ms", "1s")

**Returns:** (Number) Interval time in ms

---

## Temperature & Hardware Control

### `async temp(temp = "190")`
Set hot end temperature without blocking other operations.

**Parameters:**
- `temp` (Number or String): Target temperature in Celsius

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async tempwait(temp = "190")`
Set hot end temperature and wait for the printer to reach it (blocking).

**Parameters:**
- `temp` (Number or String): Target temperature in Celsius

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async bed(temp = "60")`
Set bed temperature without blocking.

**Parameters:**
- `temp` (Number or String): Target temperature in Celsius

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async fan(speed = "100")`
Set fan speed.

**Parameters:**
- `speed` (Number or String): Fan speed from 0-100 (percent)

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async start(hotEndTemp = "190", bedTemp = "50")`
Perform quick startup by resetting axes and moving the head to printing position.

**Parameters:**
- `hotEndTemp` (Number or String): Temperature to warm hot end to in Celsius
- `bedTemp` (Number or String): Temperature to warm bed to in Celsius

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

---

## Positioning & Movement

### Axis Getters/Setters

#### `get/set x`
Get or set the X-axis position.

**Returns/Parameters:** (Number) X position in mm

#### `get/set y`
Get or set the Y-axis position.

**Returns/Parameters:** (Number) Y position in mm

#### `get/set z`
Get or set the Z-axis position.

**Returns/Parameters:** (Number) Z position in mm

#### `get/set e`
Get or set the extruder position (filament).

**Returns/Parameters:** (Number) Filament position in mm

### Position Properties

#### `get cx`
Get the center X position of the printer bed.

**Returns:** (Number) Center X in mm

#### `get cy`
Get the center Y position of the printer bed.

**Returns:** (Number) Center Y in mm

#### `get minx` / `get miny` / `get minz`
Get minimum coordinates of the printer bed.

**Returns:** (Number) Minimum coordinate in mm

#### `set minx(v)` / `set miny(v)` / `set minz(v)`
Set minimum coordinates of the printer bed.

**Parameters:**
- `v` (Number): Minimum coordinate in mm

#### `get maxx` / `get maxy` / `get maxz`
Get maximum coordinates of the printer bed.

**Returns:** (Number) Maximum coordinate in mm

#### `set maxx(v)` / `set maxy(v)` / `set maxz(v)`
Set maximum coordinates of the printer bed.

**Parameters:**
- `v` (Number): Maximum coordinate in mm

#### `get extents`
Get the full extents of the printer workspace.

**Returns:** (Object) {minx, miny, minz, maxx, maxy, maxz}

### Movement Commands

### `async moveto(params)`
Absolute movement (move to specific coordinates).

**Parameters:**
- `params` (Object):
  - `x` (Number, optional): Target X in mm
  - `y` (Number, optional): Target Y in mm
  - `z` (Number, optional): Target Z in mm
  - `speed` (Number, optional): Movement speed in mm/s

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async move(params)`
Relative movement (move by delta from current position).

**Parameters:**
- `params` (Object):
  - `x` (Number, optional): Delta X in mm
  - `y` (Number, optional): Delta Y in mm
  - `z` (Number, optional): Delta Z in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async up(z)`
Move up quickly (positive Z movement).

**Parameters:**
- `z` (Number): Distance to move up in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async down(d)`
Move down quickly (negative Z movement).

**Parameters:**
- `d` (Number): Distance to move down in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async upto(z)`
Move to a specific height (absolute Z position).

**Parameters:**
- `z` (Number): Target Z height in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async downto(z)`
Move to a specific height (absolute Z position).

**Parameters:**
- `z` (Number): Target Z height in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `to({ x, y, z, t, note })`
Set the direction and distance based on a target point.

**Parameters:**
- `x` (Number, optional): Target X coordinate
- `y` (Number, optional): Target Y coordinate
- `z` (Number, optional): Target Z coordinate
- `t` (Number or String, optional): Time to reach target (sets speed)
- `note` (String or Number, optional): MIDI note or frequency

**Returns:** (LivePrinter) Reference to this object for chaining

### `clipToPrinterBounds(position)`
Clip object's x, y, z properties to printer bounds.

**Parameters:**
- `position` (Object): Object with x, y, z properties to clip

**Returns:** (Object) Clipped position object

---

## Drawing & Extrusion

### `async draw(dist)`
Execute an extrusion based on internally-set direction and distance.

**Parameters:**
- `dist` (Number, optional): Distance to extrude in mm. If omitted, uses internally-stored distance from `dist()`.

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async drawup(d)`
Draw upwards (extrude while moving up in Z).

**Parameters:**
- `d` (Number): Distance to draw upwards in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async dup(d)`
Shortcut for `drawup()`.

**Parameters:**
- `d` (Number): Distance to draw upwards in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async drawdown(d)`
Draw downwards (extrude while moving down in Z).

**Parameters:**
- `d` (Number): Distance to draw downwards in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async dd(d)`
Shortcut for `drawdown()`.

**Parameters:**
- `d` (Number): Distance to draw downwards in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async extrude(params)`
Relative extrusion (extrude relative to current position).

**Parameters:**
- `params` (Object):
  - `x` (Number, optional): Delta X movement
  - `y` (Number, optional): Delta Y movement
  - `z` (Number, optional): Delta Z movement
  - `e` (Number, optional): Filament extrusion amount in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

**Shortcuts:**
- `ext` - Shortcut for `extrude()`
- `ext2` - Shortcut for `extrudeto()`

### `async extrudeto(params)`
Absolute extrusion (extrude to specific coordinates).

**Parameters:**
- `params` (Object):
  - `x` (Number, optional): Target X
  - `y` (Number, optional): Target Y
  - `z` (Number, optional): Target Z
  - `e` (Number, optional): Target filament position
  - `speed` (Number, optional): Print speed in mm/s
  - `retract` (Boolean, optional): Enable retraction (default: true)
  - `thickness` or `thick` (Number, optional): Layer height
  - `bounce` (Boolean, optional): Bounce off sides (not fully implemented)

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async sendExtrusionGCode(speed)`
Send movement update GCode to printer based on current position.

**Parameters:**
- `speed` (Number): Print speed in mm/s

**Returns:** (Promise) GCode has been sent

### `async sendArcExtrusionGCode(speed, clockWise = true, retract = true)`
Send arc movement GCode for curved extrusion.

**Parameters:**
- `speed` (Number): Print speed in mm/s
- `clockWise` (Boolean): Direction of arc (default: true)
- `retract` (Boolean): Apply retraction (default: true)

**Returns:** (Promise)

---

## Time-Based Movement

### `async drawtime(time)`
Execute an extrusion for a specific amount of time with optional time-warping function.

**Parameters:**
- `time` (Number or String): Duration. Can be:
  - Number in milliseconds
  - String with suffix: "10b" (beats), "1.5s" (seconds), "500ms" (milliseconds), "1/2b" (fractional beats)

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

**Example:**
```javascript
await lp.drawtime("2b"); // Extrude for 2 beats
await lp.drawtime("1.5s"); // Extrude for 1.5 seconds
```

### `async traveltime(time)`
Execute a travel movement for a specific amount of time.

**Parameters:**
- `time` (Number or String): Duration in same formats as `drawtime()`

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async travel(dist)`
Execute a travel movement based on internally-set direction and distance.

**Parameters:**
- `dist` (Number, optional): Distance to travel in mm. If omitted, uses internally-stored distance.

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

---

## Parsing & Conversion

### `parseAsNote(note, bpm = this._bpm)`
Parse an argument as a MIDI note or frequency in Hz.

**Parameters:**
- `note` (String or Number): MIDI note as:
  - String like 'A4', 'Bb5', 'C#6'
  - Frequency string like '440hz', '11.23hz'
  - Number as MIDI note number (0-127)
- `bpm` (Number, optional): Beats per minute for reference

**Returns:** (Number) Speed in mm/s

### `parseAsTime(time, bpm = this._bpm)`
Parse argument as time notation.

**Parameters:**
- `time` (String or Number):
  - Number: milliseconds
  - String: "10b" (beats), "1.5s" (seconds), "500ms" (milliseconds)
- `bpm` (Number, optional): Beats per minute

**Returns:** (Number) Time in milliseconds

**Example:**
```javascript
const timeMs = lp.parseAsTime("1/2b", 120); // Half beat at 120 BPM
```

### `parseAsDimension(dim)`
Parse a dimension string or number.

**Parameters:**
- `dim` (String or Number):
  - Number: millimeters (default)
  - String: "10mm", "2cm", "0.5in"

**Returns:** (Number) Dimension in millimeters

**Throws:** Error if dimension format is invalid

### `parseAsDimensionOrTime(arg)`
Parse argument that could be either a dimension or time.

**Parameters:**
- `arg` (String or Number): Dimension or time string

**Returns:** (Number) Distance in mm (for dimensions) or not used for time

### `d2r(angle)`
Convert degrees to radians.

**Parameters:**
- `angle` (Number): Angle in degrees

**Returns:** (Number) Angle in radians

### `r2d(angle)`
Convert radians to degrees.

**Parameters:**
- `angle` (Number): Angle in radians

**Returns:** (Number) Angle in degrees

### `b2t(beats, bpm = this._bpm)`
Get time in milliseconds based on number of beats.

**Parameters:**
- `beats` (String or Number): Beats (or time)
- `bpm` (Number, optional): Beats per minute

**Returns:** (Number) Time in milliseconds

### `d2t(_dist, _speed, bpm)`
Calculate expected time of a movement without retraction.

**Parameters:**
- `_dist` (Number, optional): Distance in mm
- `_speed` (Number, optional): Speed in mm/s
- `bpm` (Number, optional): Beats per minute

**Returns:** (Number) Time of movement in milliseconds

### `t2d(time, speed = this._travelSpeed)`
Set movement distance based on target time to move.

**Parameters:**
- `time` (Number): Time in milliseconds
- `speed` (Number, optional): Movement speed in mm/s

**Returns:** (LivePrinter) Reference to this object for chaining

### `t2mm(time, speed = this._printSpeed, bpm = this._bpm)`
Calculate movement distance based on target time.

**Parameters:**
- `time` (Number or String): Time to move
- `speed` (Number, optional): Movement speed in mm/s
- `bpm` (Number, optional): Beats per minute

**Returns:** (Number) Distance in mm

### `n2mm(note, time = "1b", bpm = this._bpm)`
Calculate distance based on MIDI note and time.

**Parameters:**
- `note` (String or Number): MIDI note
- `time` (Number or String, optional): Time duration
- `bpm` (Number, optional): Beats per minute

**Returns:** (Number) Distance in mm

### `midi2speed(note, axis = "x")`
Calculate movement speed based on MIDI note.

**Parameters:**
- `note` (String or Number): MIDI note
- `axis` (String, optional): Axis of movement (x, y, z)

**Returns:** (Number) Speed in mm/s

### `m2s(note, axis = "x")`
Calculate and set both travel and print speed based on MIDI note.

**Parameters:**
- `note` (Number): MIDI note
- `axis` (String, optional): Axis (x, y, z, e)

**Returns:** (Number) New speed in mm/s

---

## Travel & Movement Warping

### Direction & Angle Control

### `angle`
Get or set the internal direction of movement (in XY plane).

**Parameters (setter):**
- `ang` (Number): Angle in degrees

**Returns:** (Number) Current angle in degrees

### `get angle` / `set angle(ang)`
Get/set movement angle in degrees.

### `get angler` / `set angler(ang)`
Get/set movement angle in radians.

### `getAngle(radians = false)`
Return the current angle of movement.

**Parameters:**
- `radians` (Boolean): `true` for radians, `false` for degrees

**Returns:** (Number) Movement angle

### `turnto(ang, radians = false)`
Set the direction of movement.

**Parameters:**
- `ang` (Number): Angle in degrees or radians
- `radians` (Boolean): `true` if angle is in radians

**Returns:** (LivePrinter) Reference to this object for chaining

### `turn(angle, radians = false)`
Turn (rotate) by an angle (clockwise positive, CCW negative).

**Parameters:**
- `angle` (Number): Angular turn in degrees or radians
- `radians` (Boolean): `true` if angle is in radians

**Returns:** (LivePrinter) Reference to this object for chaining

**Example:**
```javascript
lp.turn(45).turn(45).distance(40).draw(); // Turn 90° total and extrude 40mm
```

### Elevation (Z-Axis Angle)

### `elevation(angle, radians = false)`
Set the direction of movement for the Z-axis (elevation angle).

**Parameters:**
- `angle` (Number): Elevation angle in degrees or radians
- `radians` (Boolean): `true` if angle is in radians

**Returns:** (LivePrinter) Reference to this object for chaining

### `elev(_elev)`
Shortcut for `elevation()`.

**Parameters:**
- `_elev` (Number): Elevation angle

**Returns:** (LivePrinter) Reference to this object for chaining

### `tilt(_elev)`
Shortcut for `elevation()` (alias for conceptual clarity).

**Parameters:**
- `_elev` (Number): Elevation angle to tilt (90 = up, -90 = down)

**Returns:** (LivePrinter) Reference to this object for chaining

### Distance Control

### `distance(d)`
Set the distance of movement for the next operation.

**Parameters:**
- `d` (Number): Distance to move in mm

**Returns:** (LivePrinter) Reference to this object for chaining

### `dist(d)`
Shortcut for `distance()`.

**Parameters:**
- `d` (Number): Distance to move in mm

**Returns:** (LivePrinter) Reference to this object for chaining

### Movement Warping

Movement warping functions allow you to apply mathematical transformations to movements as they occur.

### `set timewarp(func)` / `get timewarp`
Set or get a time-warping function for time-based movements.

**Parameters (setter):**
- `func` (Function): Function with signature `({dt, t, tt}) => {dt, t, tt}`
  - `dt`: Delta time for this movement
  - `t`: Time in this move
  - `tt`: Total elapsed movement time

**Returns (getter):** Current time warp function

### `resettimewarp()`
Reset the time warping function to default (no-op passthrough).

**Returns:** void

### `set warp(func)` / `get warp`
Set or get a distance-warping function for distance-based movements.

**Parameters (setter):**
- `func` (Function): Function with signature `({d, heading, elevation, t, tt}) => {d, heading, elevation}`

**Returns (getter):** Current distance warp function

### `resetwarp()`
Reset the distance warping function to default (no-op passthrough).

**Returns:** void

### `_defaultWarp({ d, heading, elevation, t, tt })`
Internal default distance warping function (passthrough, no-op).

### `_defaultTimeWarp({ dt, t, tt })`
Internal default time warping function (passthrough, no-op).

### `_timeWarp({ dt, t, tt })`
Internal time warping function that applies the user-set function.

### `_warp({ d, heading, elevation, t, tt })`
Internal distance warping function that applies the user-set function.

---

## Shape Functions

### `async polygon(r, segs = 10)`
Extrude a regular polygon at the current point.

**Parameters:**
- `r` (Number): Radius of the polygon in mm
- `segs` (Number, optional): Number of segments (default: 10, more = more circular)

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async rect({ w, h })`
Extrude a rectangle with the current point as its center.

**Parameters:**
- `w` (Number): Width of rectangle in mm
- `h` (Number): Height of rectangle in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async fill(w, h, lh = this.layerHeight)`
Fill an area with parallel lines based on layer height.

**Parameters:**
- `w` (Number): Width of area in mm
- `h` (Number): Height of area in mm
- `lh` (Number, optional): Line spacing (gap between lines) in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async drawfill(w, h, gap)`
Draw (extrude) fill pattern for an area.

**Parameters:**
- `w` (Number): Width in mm
- `h` (Number): Height in mm
- `gap` (Number): Gap between fill lines in mm

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `note(note = 40, time = 200, axes = "x")`
Convert MIDI notes and duration into direction and angle for future movement.

**Parameters:**
- `note` (Number or String): MIDI note (0-127), or note name. Values below 10 are treated as pauses.
- `time` (Number, optional): Duration in milliseconds
- `axes` (String, optional): Movement axes as string (e.g., "x", "y", "xy", "xyz")

**Returns:** (LivePrinter) Reference to this object for chaining

**Example:**
```javascript
// Play MIDI note 41 for 400ms on the x & y axes
await lp.note(41, 400, "xy").travel();
```

---

## Path Printing

### `async printPaths({ paths, x, y, z, w, h, useaspect, passes, safeZ })`
Print multiple paths (lists of coordinates) with automatic scaling and multiple passes.

**Parameters:**
- `paths` (Array<Array>): List of paths, each path is a list of [x, y] coordinate pairs
- `x` (Number, optional): X offset (default: 0)
- `y` (Number, optional): Y offset (default: 0)
- `z` (Number, optional): Z height (default: 0)
- `w` (Number, optional): Width for scaling (0 = original width)
- `h` (Number, optional): Height for scaling (0 = original height)
- `useaspect` (Boolean, optional): Respect aspect ratio during scaling (default: true)
- `passes` (Number, optional): Number of passes to make (default: 1)
- `safeZ` (Number, optional): Safe Z height for traveling between paths (default: 0)

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

**Example:**
```javascript
const paths = [
  [[20, 20], [30, 30], [50, 30]],
  [[60, 20], [70, 30], [90, 30]]
];
await lp.printPaths({ paths, z: 0.2, passes: 5 });
```

### `async prime({ x, y, z, speed, e, waitTime })`
Prime the filament for a printing operation.

**Parameters:**
- `x` (Number, optional): X position for priming
- `y` (Number, optional): Y position for priming
- `z` (Number, optional): Z height for priming
- `speed` (Number, optional): Movement speed in mm/s
- `e` (Number, optional): Filament length to extrude in mm
- `waitTime` (Number, optional): Delay after extruding in ms

**Returns:** (Promise)

---

## Retraction Control

### `async retract(len = this.retractLength, speed)`
Immediately perform a retraction (pull filament back).

**Parameters:**
- `len` (Number, optional): Length of filament to retract in mm
- `speed` (Number, optional): Retraction speed in mm/s

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

**Shortcuts:**
- `ret` - Shortcut for `retract()`

### `async unretract(len = this.currentRetraction, speed)`
Immediately perform an unretraction (push filament back out).

**Parameters:**
- `len` (Number, optional): Length of filament to unretract in mm
- `speed` (Number, optional): Unretraction speed in mm/s

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

**Shortcuts:**
- `unret` - Shortcut for `unretract()`

### `async sendFirmwareRetractSettings()`
Send current retraction settings to the printer firmware.

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async fwretract(state)`
Enable or disable firmware-based retraction (applies to every move automatically).

**Parameters:**
- `state` (Boolean): `true` to enable, `false` to disable

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

---

## Utility & Loop Functions

### `async wait(t = this._waitTime)`
Causes the printer to wait (pause) for a specified time.

**Parameters:**
- `t` (Number or String, optional): Time to wait. Can be:
  - Number in milliseconds
  - String: "10b", "1.5s", "500ms"

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

**Example:**
```javascript
await lp.wait(1000); // Wait 1 second
await lp.wait("2b"); // Wait 2 beats
```

### `async pause()`
Temporarily pause the printer: move head up, turn off fan and temperature.

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async resume(temp = "190")`
Resume the printer printing: turn on fan and temperature again.

**Parameters:**
- `temp` (Number or String, optional): Hot end temperature to resume at

**Returns:** (Promise<LivePrinter>) Reference to this object for chaining

### `async sync()`
Synchronize internal variables like position and temperature with the printer.

**Returns:** (Promise)

### `async delay(t)`
Quick and dirty (inexact) delay function using JavaScript setTimeout.

**Parameters:**
- `t` (Number): Time in milliseconds

**Returns:** (Promise) Resolves after delay

### `async mainloop(func)`
Run a function as a "main loop" until quit using `bail()`. Don't await this function to make sure you can still break the loop later!

**Parameters:**
- `func` (Function): Async function to run inside the loop

**Returns:** (Promise) Resolves when loop ends

**Example:**
```javascript
// Start a loop (don't await it!)
lp.mainloop(async () => {
  await lp.turn(10).distance(10).draw();
});

// Later, stop the loop
setTimeout(() => lp.bail(true), 5000); // Stop after 5 seconds
```

### `bail(state = true, height = 5)`
Tell the main loop to bail out (stop looping). Optionally move up when done.

**Parameters:**
- `state` (Boolean): `true` to stop the loop
- `height` (Number, optional): Height to move up when exiting (default: 5mm)

**Returns:** (Promise)

### `pause(t = 100)`
Set a pause time in the main loop (0 to turn off pausing).

**Parameters:**
- `t` (Number): Pause time in milliseconds

**Returns:** (Number) Current pause time in milliseconds

### `speedScale()`
Get speed scales for MIDI note mapping from the printer model.

**Returns:** (Object) {x, y, z} speed scaling factors

### `run(strings)` ⚠️ **EXPERIMENTAL/BROKEN**
Run a set of commands specified in a grammar string.

**Note:** This function is currently broken and not recommended for use.

---

## Listener Management

### `addGCodeListener(l)`
Register a listener to be notified when GCode is ready.

**Parameters:**
- `l` (Object): Listener object with `gcodeEvent(gcode)` method

**Returns:** void

### `addPrintListener(l)`
Register a listener to be notified of print events.

**Parameters:**
- `l` (Object): Listener object with `printEvent(eventData)` method

**Returns:** void

### `addErrorListener(l)`
Register a listener to be notified of errors.

**Parameters:**
- `l` (Object): Listener object with `errorEvent(error)` method

**Returns:** void

### `removeGCodeListener(l)`
Unregister a GCode listener.

**Parameters:**
- `l` (Object): Listener object to remove

**Returns:** void

### `removePrintListener(l)`
Unregister a print event listener.

**Parameters:**
- `l` (Object): Listener object to remove

**Returns:** void

### `removeErrorListener(l)`
Unregister an error listener.

**Parameters:**
- `l` (Object): Listener object to remove

**Returns:** void

---

## Method Shortcuts Reference

For convenient live coding, many methods have abbreviated aliases:

| Full Name | Shortcut | Purpose |
|-----------|----------|---------|
| `printspeed()` | `psp()` | Set/get print speed |
| `drawspeed()` | `dsp()` | Set/get draw speed |
| `travelspeed()` | `tsp()` | Set/get travel speed |
| `layerHeight` | `lh` | Layer height (get/set) |
| `distance()` | `dist()` | Set distance |
| `elevation()` | `elev()` | Set elevation (alias) |
| `elevation()` | `tilt()` | Set tilt (alias) |
| `turn()` | `tur()` | Turn/rotate |
| `turnto()` | `tur2()` | Turn to direction |
| `extrude()` | `ext()` | Extrude |
| `extrudeto()` | `ext2()` | Extrude to |
| `move()` | `mov()` | Move (relative) |
| `moveto()` | `mov2()` | Move to (absolute) |
| `retract()` | `ret()` | Retract filament |
| `unretract()` | `unret()` | Unretract filament |
| `drawup()` | `dup()` | Draw upwards |
| `drawdown()` | `dd()` | Draw downwards |

---

## Events Reference

Print events can have the following types:

- `draw-start` / `draw-end` - Extrusion operation
- `drawtime-start` / `drawtime-end` - Time-based extrusion
- `travel-start` / `travel-end` - Travel movement
- `traveltime-start` / `traveltime-end` - Time-based travel
- `retract` - Filament retraction
- `unretract` - Filament unretractionm
- `extrude` - Relative extrusion
- `travel` - Relative travel
- And others...

---

## Time & Beat Notation

Times and beats can be specified in multiple ways:

- **Milliseconds**: `1000`
- **Seconds**: `"1.5s"`
- **Beats**: `"2b"`, `"1/2b"`, `"1 1/2b"`
- **Combined**: `"1 1/4b"` (1.25 beats)

---

## License

GNU Affero 3.0 License (AGPL-3.0)  
Copyright (c) 2022 Evan Raskob and others
