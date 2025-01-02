import { Vector, Logger } from "liveprinter-utils";
import { Note } from "tonal";
const MAX_SPEED = {
  UM2plus: {
    maxTravel: { x: 300, y: 300, z: 80, e: 45 },
    maxPrint: { x: 250, y: 250, z: 150, e: 45 }
  },
  UM2: {
    maxTravel: { x: 300, y: 300, z: 80, e: 45 },
    maxPrint: { x: 250, y: 250, z: 150, e: 45 }
  },
  UM3: {
    maxTravel: { x: 300, y: 300, z: 80, e: 45 },
    maxPrint: { x: 250, y: 250, z: 150, e: 45 }
  },
  REPRAP: {
    maxTravel: { x: 300, y: 300, z: 80, e: 45 },
    maxPrint: { x: 250, y: 250, z: 150, e: 45 }
  }
}, BED_SIZE = {
  UM3: { x: 223, y: 223, z: 305 },
  UM2: { x: 223, y: 223, z: 205 },
  UM2plus: { x: 223, y: 223, z: 305 },
  REPRAP: { x: 150, y: 150, z: 80 }
}, SPEED_SCALE = {
  UM3: { x: 47.069852, y: 47.069852, z: 160 },
  UM2: { x: 47.069852, y: 47.069852, z: 160 },
  UM2plus: { x: 47.069852, y: 47.069852, z: 160 },
  REPRAP: { x: 47.069852, y: 47.069852, z: 160 }
}, FilamentDiameter = { UM3: 2.85, UM2: 2.85, UM2plus: 2.85, REPRAP: 1.75 }, ExtrusionInmm3 = { UM3: !1, UM2: !1, UM2plus: !0, REPRAP: !1 };
/**
 * Core Printer API of LivePrinter, an interactive programming system for live CNC manufacturing.
 * @version 1.0
 * @example <caption>Log GCode to console:</caption>
 * let printer = new Printer(msg => Logger.debug(msg)); * Communications between server, GUI, and events functionality for LivePrinter.
 * @author Evan Raskob <evanraskob+nosp4m@gmail.com>
 * @version 1.0
 * @license
 * Copyright (c) 2022 Evan Raskob and others
 * Licensed under the GNU Affero 3.0 License (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     {@link https://www.gnu.org/licenses/gpl-3.0.en.html}
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
const MinLayerHeight = 0.05, MIN_INTERVAL = 5.357, TimeRegex = /(\d+|\d+\.\d+|\d+\/\d+)(s|ms|b)/i;
class LivePrinter {
  ///////
  // Printer API /////////////////
  ///////
  /**
   * Create new instance
   * @constructor
   * @param {String} model Valid model from printers.js
   */
  constructor(t = "UM2plus") {
    this.ext = this.extrude, this.ext2 = this.extrudeto, this.mov = this.move, this.mov2 = this.moveto, this.tur = this.turn, this.tur2 = this.turnto, this.ret = this.retract, this.unret = this.unretract, this.gcodeListeners = [], this.printListeners = [], this.errorListeners = [], this.opListeners = [], this._layerHeight = 0.2, this.lastSpeed = -1, this._heading = 0, this._elevation = 0, this._distance = 0, this._waitTime = 0, this._autoRetract = !0, this._bpm = 120, this._intervalTime = 16, this.totalMoveTime = 0, this.maxFilamentPerOperation = 30, this.minFilamentPerOperation = 2e-4, this.maxTimePerOperation = 6e4, this.currentRetraction = 0, this.retractLength = 8.5, this._retractSpeed = 30 * 60, this.firmwareRetract = !1, this.extraUnretract = 0, this.unretractZHop = 0, this.boundaryMode = "stop", this.maxMovePerCycle = 200, this.setProperties(t);
  }
  /**
   * Set default properties for the printer based on the printer model, e.g. bed size, speeds
   * @param {String} model Valid model from printers.js
   */
  setProperties(t) {
    this._model = t, this._maxTravelSpeed = MAX_SPEED[t].maxTravel, this._maxPrintSpeed = MAX_SPEED[t].maxPrint, this._travelSpeed = this._maxTravelSpeed.x, this._printSpeed = this._maxPrintSpeed.x / 3, this._speedScale = SPEED_SCALE[t], this._bedSize = BED_SIZE[t], this._extrusionInmm3 = ExtrusionInmm3[t], this._filamentDiameter = FilamentDiameter[t], this.minPosition = new Vector({
      x: 0,
      // x position in mm
      y: 0,
      // y position in mm
      z: 0,
      // z position in mm
      e: -99999
    }), this.maxPosition = new Vector({
      x: this._bedSize.x,
      // x position in mm
      y: this._bedSize.y,
      // y position in mm
      z: this._bedSize.z,
      // z position in mm
      e: 999999
    }), this.position = new Vector({
      x: this.minPosition.axes.x,
      // x position in mm
      y: this.minPosition.axes.y,
      // y position in mm
      z: this.minPosition.axes.z,
      // z position in mm
      e: 0
    });
  }
  /**
   *  Notify listeners that GCode is ready to be consumed.
   *  @param {String} gcode GCode command string to send
   *  @returns{any} Nothing.
   */
  async gcodeEvent(t) {
    await Promise.all(
      this.gcodeListeners.map(async (e) => e.gcodeEvent(t))
    ), Logger.debug(t);
  }
  //
  // shorthand for livecoding
  //
  async gcode(t) {
    return this.gcodeEvent(t);
  }
  /**
       *  Notify listeners that a printing operation happened.
       *  @param {String} eventData Event data object to send
       * @example 
       *  this.printEvent({
                  'type': 'travel',
                  'newPosition': newPosition.axes, 
                  'oldPosition':this.position.axes,
                  'speed':this.travelSpeed,
                  'moveTime': moveTime,
                  'totalMoveTime': this.totalMoveTime,
                  'layerHeight': this.layerHeight,
                  'length': length
              });
  
              or
  
              this.printEvent({
                  'type': 'extrude',
                  'newPosition': newPosition.axes, 
                  'oldPosition':this.position.axes,
                  'speed':this.printSpeed,
                  'moveTime': moveTime,
                  'totalMoveTime': this.totalMoveTime,
                  'layerHeight': this.layerHeight
                  'length': length 
              });
  
              of
  
              this.printEvent({
                  'type': 'retract',
                  'speed':this.retractSpeed,
                  'length': this.retractLength,
              });
  
              this.printEvent({
                  'type': 'unretract',
                  'speed':this.retractSpeed,
                  'length': this.retractLength,
              });
       *
       */
  async printEvent(t) {
    await Promise.all(
      this.printListeners.map(async (e) => e.printEvent(t))
    ), Logger.debug(`Print event: ${JSON.stringify(t, null, 2)}`);
  }
  /**
   *  Notify listeners that an error has taken place.
   *  @param {Error} err GCode command string to send
   *  @returns{any} Nothing.
   */
  async errorEvent(t) {
    await Promise.all(
      this.errorListeners.map(async (e) => e.errorEvent(t))
    );
  }
  addGCodeListener(t) {
    this.gcodeListeners.includes(t) || this.gcodeListeners.push(t);
  }
  addPrintListener(t) {
    this.printListeners.includes(t) || this.printListeners.push(t);
  }
  addErrorListener(t) {
    this.errorListeners.includes(t) || this.errorListeners.push(t);
  }
  removeGCodeListener(t) {
    this.gcodeListeners = this.gcodeListeners.filter(
      (e) => e != t
    );
  }
  removePrintListener(t) {
    this.printListeners = this.printListeners.filter(
      (e) => e != t
    );
  }
  removeErrorListener(t) {
    this.errorListeners = this.errorListeners.filter(
      (e) => e != t
    );
  }
  /// -------------------------------------------------------------------
  /// -------- getters/setters - note these are lower case --------------
  /// ----------------  on purpose for easier typing --------------------
  /// -------------------------------------------------------------------
  get x() {
    return this.position.axes.x;
  }
  get y() {
    return this.position.axes.y;
  }
  get z() {
    return this.position.axes.z;
  }
  get e() {
    return this.position.axes.e;
  }
  set x(t) {
    this.position.axes.x = t;
  }
  set y(t) {
    this.position.axes.y = t;
  }
  set z(t) {
    this.position.axes.z = t;
  }
  set e(t) {
    this.position.axes.e = t;
  }
  /**
   * readonly total movetime
   */
  get time() {
    return this.totalMoveTime;
  }
  set optime(t) {
    this.maxTimePerOperation = t;
  }
  get optime() {
    return this.maxTimePerOperation;
  }
  /**
   * set printer model (See Printer class for valid ones)
   * @param {String} m Valid model from Printer class
   * @see setProperties()
   */
  set model(t) {
    this.setProperties(t);
  }
  get model() {
    return this._model;
  }
  /**
   * Set printing speed.
   * @param {Number} s speed in units per second, ex: 30mm/s
   * @returns Number
   */
  printspeed(t) {
    if (t !== void 0) {
      const e = this.parseAsTime(t);
      let i = this._maxPrintSpeed;
      this._printSpeed = Math.min(e, parseFloat(i.x));
    }
    return this._printSpeed;
  }
  /**
   * Shortcut for printspeed
   * @param {Number} s speed
   * @returns {Number} speed in mm/s
   */
  psp(t) {
    return this.printspeed(t);
  }
  /**
   * Shortcut for printspeed for consistency when using "draw" functions
   * @param {Number} s speed
   * @returns {Number} speed in mm/s
   */
  drawspeed(t) {
    return this.printspeed(t);
  }
  /**
   * Shortcut for printspeed for consistency when using "draw" functions
   * @param {Number} s speed
   * @returns {Number} speed in mm/s
   */
  dsp(t) {
    return this.printspeed(t);
  }
  /**
   * Set travel speed.
   * @param {Number} s speed in units per second, ex: 30mm/s
   * @returns {Number} speed in mm/s
   */
  travelspeed(t) {
    if (t !== void 0) {
      const e = this.parseAsTime(t);
      let i = this._maxTravelSpeed;
      this._travelSpeed = Math.min(e, parseFloat(i.x));
    }
    return this._travelSpeed;
  }
  // shortcut
  tsp(t) {
    return this.travelspeed(t);
  }
  /**
   * Set both travel and printing speeds at once.
   * @param {Number} s speed
   * @returns {Number} speed in mm/s
   */
  speed(t) {
    return this.printspeed(this.travelspeed(t));
  }
  get maxspeed() {
    return this._maxPrintSpeed.x;
  }
  // in mm/s
  get extents() {
    return this.maxPosition.axes;
  }
  /**
   * Set automatic retraction state
   * @param {Boolean} state
   * @returns Boolean automatic retraction state
   */
  autoretract(t = !0) {
    return t ? this._autoRetract = t : this._autoRetract = !1, this._autoRetract;
  }
  /**
   * Get the center horizontal (x) position on the bed
   */
  get cx() {
    return this.minx + (this.maxx - this.minx) / 2;
  }
  /**
   * Get the center vertical (y) position on the bed,
   */
  get cy() {
    return this.miny + (this.maxy - this.miny) / 2;
  }
  /// maximum values
  get minx() {
    return this.minPosition.axes.x;
  }
  get miny() {
    return this.minPosition.axes.y;
  }
  get minz() {
    return this.minPosition.axes.z;
  }
  /// maximum values
  set minx(t) {
    this.minPosition.axes.x = t;
  }
  set miny(t) {
    this.minPosition.axes.y = t;
  }
  set minz(t) {
    this.minPosition.axes.z = t;
  }
  // maximum values
  get maxx() {
    return this.maxPosition.axes.x;
  }
  get maxy() {
    return this.maxPosition.axes.y;
  }
  get maxz() {
    return this.maxPosition.axes.z;
  }
  set maxx(t) {
    this.maxPosition.axes.x = t;
  }
  set maxy(t) {
    this.maxPosition.axes.y = t;
  }
  set maxz(t) {
    this.maxPosition.axes.z = t;
  }
  /**
   * Return internal angle in degrees (because everything is in degrees unless otherwise specified)
   */
  get angle() {
    return this.r2d(this._heading);
  }
  /**
   * Set the internal direction of movement for the next operation in degrees.
   * @param {float} ang Angle of movement (in xy plane) in degrees
   */
  set angle(t) {
    this._heading = this.d2r(t);
  }
  /**
   * Return internal angle in radians
   */
  get angler() {
    return this._heading;
  }
  /**
   * Set the internal direction of movement for the next operation in radians.
   * @param {float} ang Angle of movement (in xy plane) in radians
   */
  set angler(t) {
    this._heading = t;
  }
  /**
   * set bpm for printer, for calculating beat-based movements
   * @param {Number} beats Beats per minute
   */
  bpm(t = this._bpm) {
    return this._bpm = t, this._bpm;
  }
  /**
   * set bps for printer, for calculating beat-based movements
   * @param {Number} beats Beats per second
   */
  bps(t) {
    return this._bpm = t * 60, this._bpm;
  }
  /**
   * Set minimum movement time interval for printer movements, used in drawtime() for calculating time-based movements
   * @param {Number or String} time If a non-zero number, extrude for the time specified in ms, or if a String parse the suffix for b=beats, s=seconds, ms=milliseconds (e.g. "20ms")
   * @see drawtime
   * @see traveltime
   * @see timewarp
   * @see warp
   */
  interval(t) {
    if (this._intervalTime = this.parseAsTime(t), this._intervalTime < MIN_INTERVAL)
      throw this._intervalTime = MIN_INTERVAL, new Error(
        `Error setting interval() time, too short: ${targetTime} < ${MIN_INTERVAL}`
      );
    return this;
  }
  /**
   * Retraction speed - updates firmware on printer too
   * @param {Number} s Option speed in mm/s to set, otherwise just get
   */
  async retractspeed(t) {
    if (t !== void 0) {
      const e = this.parseAsTime(t);
      this._retractSpeed = e * 60, await this.sendFirmwareRetractSettings();
    }
    return this._retractSpeed;
  }
  get retractSpeed() {
    return this._retractSpeed;
  }
  /**
   * Set the extrusion thickness (in mm)
   * @param {float} val thickness of the extruded line in mm
   * @returns {Printer} reference to this object for chaining
   */
  thick(t) {
    return t !== void 0 && (this.layerHeight = parseFloat(t)), this.layerHeight;
  }
  /**
   * Send the current retract settings to the printer (useful when updating the retraction settings locally)
   * @returns {Printer} reference to this object for chaining
   */
  async sendFirmwareRetractSettings() {
    return await this.gcodeEvent(
      "M207 S" + this.retractLength.toFixed(2) + " F" + this._retractSpeed.toFixed(2) + " Z" + this.unretractZHop.toFixed(2)
    ), await this.gcodeEvent(
      "M208 S" + (this.retractLength.toFixed(2) + this.extraUnretract.toFixed(2)) + " F" + this._retractSpeed.toFixed(2)
    ), this;
  }
  /**
   * Immediately perform a "retract" which is a shortcut for just moving the filament back up at a speed.  Sets the internal retract variables to those passed in.
   * @param {Number} len Length of filament to retract.  Set to 0 to use current setting (or leave out)
   * @param {Number} speed (optional) Speed of retraction. Will be clipped to max filament feed speed for printer model.
   * @returns {Printer} reference to this object for chaining
   */
  async retract(t = this.retractLength, e) {
    if (this.currentRetraction > 0) return;
    if (t < 0)
      throw new Error("[API] retract length can't be less than 0: " + t);
    let i = !1;
    t !== this.retractLength && (i = !0), this.retractLength = t;
    let r = !1;
    if (e !== void 0) {
      if (e <= 0)
        throw new Error("[API] retract speed can't be 0 or less: " + e);
      if (e > this._maxPrintSpeed.e)
        throw new Error("[API] retract speed to high: " + e);
      r = !0, this._retractSpeed = e * 60;
    }
    if (this.currentRetraction = this.retractLength, this.e -= this.currentRetraction, this.firmwareRetract)
      (r || i) && await this.sendFirmwareRetractSettings(), await this.gcodeEvent("G10");
    else {
      const s = this.e.toFixed(4);
      await this.gcodeEvent(
        "G1 E" + s + " F" + this._retractSpeed.toFixed(4)
      ), this.e = parseFloat(s);
    }
    return this.printEvent({
      type: "retract",
      speed: this.retractSpeed,
      length: this.retractLength
    }), this;
  }
  /**
   * Immediately perform an "unretract" which is a shortcut for just extruding the filament out at a speed.  Sets the internal retract variables to those passed in.
   * @param {Number} len Length of filament to unretract.  Set to 0 to use current setting (or leave out)
   * @param {Number} speed (optional) Speed of unretraction. Will be clipped to max filament feed speed for printer model.
   * @returns {Printer} reference to this object for chaining
   */
  async unretract(t = this.currentRetraction, e) {
    if (this.currentRetraction < 0.01)
      return;
    if (t < 0)
      throw new Error("[API] retract length can't be less than 0: " + t);
    let i = !1;
    t !== this.retractLength && (i = !0), this.retractLength = t;
    let r = !1;
    if (e !== void 0) {
      if (e <= 0)
        throw new Error("[API] retract speed can't be 0 or less: " + e);
      if (e > this._maxPrintSpeed.e)
        throw new Error("[API] retract speed too high: " + e);
      r = !0, this._retractSpeed = e * 60;
    }
    return this.e += this.retractLength + this.extraUnretract, this.firmwareRetract ? ((r || i) && await this.sendFirmwareRetractSettings(), await this.gcodeEvent("G11")) : (this.e = parseFloat(this.e.toFixed(4)), this.currentRetraction = 0, await this.gcodeEvent("; unretract"), await this.gcodeEvent(
      "G1 E" + this.e + " F" + this._retractSpeed.toFixed(4)
    )), this.printEvent({
      type: "unretract",
      speed: this.retractSpeed,
      length: this.retractLength
    }), this;
  }
  /**
   * Performs a quick startup by resetting the axes and moving the head
   * to printing position (layerheight).
   * @param {float} hotEndTemp is the temperature to start warming hot end up to (only 1 supported)
   * @param {float} bedTemp is the temperature to start warming bed up to
   * @returns {Printer} reference to this object for chaining
   */
  async start(t = "190", e = "50") {
    return await this.gcodeEvent("G28"), await this.gcodeEvent("M114"), await this.gcodeEvent("M106 S0"), await this.gcodeEvent("M104 S" + t), await this.sendFirmwareRetractSettings(), this.x = 0, this.y = this.maxy, this.z = this.maxz, this.totalMoveTime = 0, this.printspeed(this._defaultPrintSpeed), this.travelspeed(this._defaultPrintSpeed), await this.sync(), this;
  }
  /**
   * Set hot end temperature, don't block other operation.
   * @param {float} temp is the temperature to start warming up to
   * @returns {Printer} reference to this object for chaining
   */
  async temp(t = "190") {
    return await this.gcodeEvent("M104 S" + t), this;
  }
  /**
   * Set hot end temperature, block other operation and wait to reach temp.
   * @param {float} temp is the temperature to start warming up to
   * @returns {Printer} reference to this object for chaining
   */
  async tempwait(t = "190") {
    return await this.gcodeEvent("M109 S" + t), this;
  }
  /**
   * Set bed temperature, don't block other operation.
   * to printing position (layerheight).
   * @param {float} temp is the temperature to start warming up to
   * @returns {Printer} reference to this object for chaining
   */
  async bed(t = "190") {
    return await this.gcodeEvent("M140 S" + t), this;
  }
  /**
   * Set fan speed.
   * @param {float} speed is the speed from 0-100
   * @returns {Printer} reference to this object for chaining
   */
  async fan(t = "100") {
    return await this.gcodeEvent("M106 S" + t), this;
  }
  /**
   * clip object's x,y,z properties to printer bounds and return it
   * @param {object} position: object with x,y,z properties clip
   * @returns {object} position clipped object
   */
  clipToPrinterBounds(t) {
    return t.x = Math.min(t.x, this.maxx), t.y = Math.min(t.y, this.maxy), t.z = Math.min(t.z, this.maxz), t.x = Math.max(t.x, this.minx), t.y = Math.max(t.y, this.miny), t.z = Math.max(t.z, this.minz), t;
  }
  /**
   * Set the distance and heading based on a target point
   * TODO: Elevation and zdistance need fixing!
   *
   * @param {Object} coordinates (x,y,z coordinates and target time in any time notation (sets speed))
   * @returns {Object} this instance for chaining
   */
  to({ x: t, y: e, z: i, t: r } = {}) {
    const s = new Vector(
      t || this.x,
      e || this.y,
      i || this.z
    ), h = i ? i - this.z : 0, m = Vector.sub(s, this.position);
    if (this._distance = m.mag(), this._elevation = Math.atan2(
      h,
      Math.hypot(m.axes.x, m.axes.y)
    ), this._distance + this._elevation < 1e-5) {
      this._elevation = 0, this._distance = 0;
      return;
    }
    return this._heading = Math.atan2(m.axes.y, m.axes.x), Logger.debug(`heading ${this._heading}`), Logger.debug(`heading ${this.angle}`), r && this.speed(1e3 * this._distance / this.parseAsTime(r)), this;
  }
  //------------------------------------------------
  //------------------------------------------------
  // --- Time and space warping functions for drawing and movements
  //------------------------------------------------
  //------------------------------------------------
  /**
   * Default distance warping function: does nothing but pass through arguments.
   * @param {Object} args d (dist), heading, elevation, t (time in this move), tt (total elapsed movement time)
   * @returns {Object} new d, heading, elevation
   * @see timewarp
   * @see warp
   * @see interval
   */
  _defaultWarp({ d: t, heading: e, elevation: i, t: r, tt: s } = {}) {
    return { d: t, heading: e, elevation: i };
  }
  /**
   * Default time warping function: does nothing but pass through arguments.
   * @param {Object} args dt (delta time), t (time in this move), tt (total elapsed movement time)
   * @returns {Object} new dt, t, tt
   * @see timewarp
   * @see warp
   * @see interval
   */
  _defaultTimeWarp({ dt: t, t: e, tt: i } = {}) {
    return t;
  }
  /**
   * Applies a time-warping function set by user. Default is no-op
   * @param {Number} dt Delta time, time interval for this movement; t (time in this move); tt (total elapsed movement time)
   * @returns {Number} new dt
   * @see timewarp
   * @see warp
   * @see interval
   */
  _timeWarp({ dt: t, t: e, tt: i }) {
    return t;
  }
  /**
   * Set time based movement function
   * @param {Function} func Movement function
   * @see drawtime
   * @see traveltime
   * @see interval
   */
  set timewarp(t) {
    this._timeWarp = t;
  }
  /**
   * Get time based movement function
   * @see drawtime
   * @see traveltime
   * @see interval
   */
  get timewarp() {
    return this._timeWarp;
  }
  /**
   * Reset the movement function to the default (passthru)
   * @see drawtime
   * @see traveltime
   * @see interval
   */
  resettimewarp() {
    return this.timewarp = this._defaultTimeWarp, this;
  }
  /**
   * Applies a distance-varying movement function set by user. Default is no op
   * @param {Object} args d (dist), heading, elevation, t (time in this move), tt (total elapsed movement time)
   * @returns {Object} new d, heading, elevation
   * @see timewarp
   * @see warp
   * @see interval
   */
  _warp({ d: t, heading: e, elevation: i, t: r, tt: s } = {}) {
    return { d: t, heading: e, elevation: i };
  }
  /**
   * Set time based movement function
   * @param {Function} func Movement function
   * @see draw
   * @see interval
   */
  set warp(t) {
    this._warp = t;
  }
  /**
   * Get time based movement function
   * @see draw
   * @see interval
   */
  get warp() {
    return this._warp;
  }
  /**
   * Reset the movement function to the default (passthru)
   * @see draw
   * @see interval
   */
  resetwarp() {
    return this.warp = this._defaultWarp, this;
  }
  //------------------------------------------------
  //------------------------------------------------
  // --- Drawing and movement functions
  //------------------------------------------------
  //------------------------------------------------
  /**
   * Parse an argument (beats, seconds, ms) to time in ms
   * @param {String or Number} time
   * @returns time in ms
   */
  async drawtime(t) {
    const e = this.totalMoveTime;
    let i = 0, r = 0;
    const s = { speed: this._printSpeed };
    try {
      i = this.parseAsTime(t);
    } catch (m) {
      throw m;
    }
    this.printEvent({
      type: "drawtime-start",
      speed: this._printSpeed,
      start: e,
      end: i
    }), i += this.totalMoveTime, this._distance = 0;
    let h = 2e4;
    for (; h && this.totalMoveTime < i; ) {
      h--;
      const m = performance.now(), v = this.x, g = this.y, x = this.z, f = this.totalMoveTime - e, l = this._timeWarp({
        dt: this._intervalTime,
        t: f,
        tt: this.totalMoveTime
      }), u = this.t2mm(l);
      let d = 0, a = u;
      const { d: n, heading: w, elevation: y } = this._warp({
        d: u,
        heading: this._heading,
        elevation: this._elevation,
        t: f,
        tt: this.totalMoveTime
      });
      a = n, r += n, Math.abs(y) > Number.EPSILON && (a = n * Math.cos(y), d = n * Math.sin(y)), Logger.debug(`Moved ${n} over (${l} ms) to ${r}}`), s.x = v + a * Math.cos(w), s.y = g + a * Math.sin(w), s.z = x + d, await this.extrudeto(s), Logger.debug(
        `Move time warp op took ${performance.now() - m} ms vs. expected ${this._intervalTime}.`
      ), this.printEvent({
        type: "drawtime-start",
        speed: this._printSpeed,
        start: e,
        end: i
      });
    }
    return this;
  }
  /**
   * Parse argument as time (10b, 1/2b, 20ms, 30s, 1000)
   * @param {Any} time as beats, millis, seconds: 10b, 1/2b, 20ms, 30s, 1000
   * @returns {Number} time in ms
   */
  parseAsTime(time, bpm = this._bpm) {
    let targetTime;
    if (isFinite(time))
      targetTime = time;
    else {
      let timeStr = time + "";
      if (timeStr = timeStr.toLowerCase(), /^[a-z]/.test(timeStr))
        return targetTime = this.m2s(timeStr), targetTime;
      const params = timeStr.match(TimeRegex);
      if (params && params.length == 3) {
        const numberParam = eval(params[1]);
        switch (params[2]) {
          case "s":
            targetTime = numberParam / 1e3;
            break;
          case "ms":
            targetTime = numberParam;
            break;
          case "b":
            targetTime = 6e4 / bpm * numberParam;
            break;
          default:
            throw new Error(
              `parseAsTime::Error parsing time, bad time suffix in ${timeStr}`
            );
        }
      } else
        throw new Error(
          `parseAsTime::Error parsing time, check the format of ${timeStr}`
        );
    }
    return targetTime;
  }
  /**
   * Execute an extrusion based on the internally-set direction/elevation/distance, with an optional time-based function.
   * @param {Number} extrude
   * Optional: the amount specified in mm, or left out then the stored distance set
   * by dist().
   * @returns {Printer} reference to this object for chaining
   */
  async draw(t) {
    const e = this.totalMoveTime;
    let i = 0;
    this._distance = t && isFinite(t) ? t : this._distance;
    const r = this._distance, s = { speed: this._printSpeed };
    let h = 2e4;
    for (this.printEvent({
      type: "draw-start",
      speed: this._printSpeed,
      length: this._distance
    }); h && i < r; ) {
      h--;
      const m = this.totalMoveTime - e, v = performance.now(), g = this.x, x = this.y, f = this.z, l = this._timeWarp({
        dt: this._intervalTime,
        t: m,
        tt: this.totalMoveTime
      }), u = Math.min(this.t2mm(l), r - i), { d, heading: a, elevation: n } = this._warp({
        d: u,
        heading: this._heading,
        elevation: this._elevation,
        t: m,
        tt: this.totalMoveTime
      });
      if (u + n < 1e-5) {
        console.error(
          `draw() SHORT: ${h}, ${r} ${r - i} / ${u}`
        );
        break;
      }
      let w = d * Math.sin(n), y = d * Math.cos(n);
      s.x = g + y * Math.cos(a), s.y = x + y * Math.sin(a), s.z = f + w, await this.extrudeto(s), i += u, Logger.debug(
        `Moved ${u} to ${i} towards ${r}`
      ), Logger.debug(
        `Move draw warp op took ${performance.now() - v} ms vs. expected ${this._intervalTime}.`
      );
    }
    return this._elevation = 0, this._distance = 0, this.printEvent({
      type: "draw-end",
      speed: this._printSpeed,
      length: i
    }), this;
  }
  /**
   * Set/get layer height safely and easily.
   *
   * @param {float} height layer height in mm
   * @returns {Printer} Reference to this object for chaining
   */
  set layerHeight(t) {
    this._layerHeight = Math.max(MinLayerHeight, t);
  }
  //shortcut
  set lh(t) {
    this._layerHeight = Math.max(MinLayerHeight, t);
  }
  get layerHeight() {
    return this._layerHeight;
  }
  //shortcut
  get lh() {
    return this._layerHeight;
  }
  /**
   * Return the current angle of movement
   * @param {Boolean} radians true if you want it in radians (default is false, in degrees)
   * @returns {Number} angle of movement in degrees (default) or radians
   */
  getAngle(t = !1) {
    return t ? this._heading : this.r2d(this._heading);
  }
  /**
   * Set the direction of movement for the next operation.
   * @param {float} ang Angle of movement (in xy plane)
   * @param {Boolean} radians use radians or not
   * @returns {Printer} Reference to this object for chaining
   */
  turnto(t, e = !1) {
    return this._heading = e ? t : this.d2r(t), this;
  }
  /**
   * TODO: THIS IS TOTALLY BROKEN, IGNORE FOR NOW
   *
   * Run a set of commands specified in a grammar (experimental.)
   * @param {String} strings commands to run - M(move),E(extrude),L(left turn),R(right turn)
   * @returns {Printer} Reference to this object for chaining
   */
  run(t) {
    const e = "M", i = "E", r = "L", s = "R", h = "U", m = "D", v = "<", g = ">", x = /([a-zA-Z<>][0-9]+\.?[0-9]*)/gim, f = /([a-zA-Z<>])([0-9]+\.?[0-9]*)/, l = t.match(x);
    for (let u of l) {
      let d = u.match(f);
      if (d.length !== 3)
        throw new Error("[API] Error in command string: " + l);
      const a = d[1].toUpperCase(), n = parseFloat(d[2]);
      switch (a) {
        case e:
          this.distance(n).go();
          break;
        case i:
          this.distance(n).go(1, !1);
          break;
        case r:
          this.turn(n);
          break;
        case s:
          this.turn(-n);
          break;
        case h:
          this.up(n).go();
          break;
        case m:
          this.down(n).go();
          break;
        case v:
          this.retract(n);
          break;
        case g:
          this.unretract(n);
          break;
        default:
          throw new Error(
            "[API] Error in command - unknown command char: " + a
          );
      }
    }
    return this;
  }
  /**
   * Move up quickly! (in mm)
   * @param {Number} d distance in mm to move up
   * @returns {Printer} Reference to this object for chaining
   */
  async up(t) {
    return this.move({ z: t, speed: this._travelSpeed });
  }
  /**
   * Move up quickly! (in mm)
   * @param {Number} d distance in mm to draw upwards
   * @returns {Printer} Reference to this object for chaining
   */
  async drawup(t) {
    const e = t;
    return this._elevation = Math.PI / 2, this.draw({ z: e });
  }
  // shortcut
  async dup(t) {
    return this.drawup(t);
  }
  /**
   * Move up to a specific height quickly! (in mm). It might seem silly to have both, upto and downto,
   * but conceptually when you're making something it makes sense, even if they do the same thing.
   * @param {Number} hz z height mm to move up to
   * @returns {Printer} Reference to this object for chaining
   */
  async upto(t) {
    return this.moveto({ z: t, speed: this._travelSpeed });
  }
  /**
   * Move up to a specific height quickly! (in mm)
   * @param {Number} z height in mm to move to
   * @returns {Printer} Reference to this object for chaining
   */
  async downto(t) {
    return this.upto(t);
  }
  /**
   * Move down quickly! (in mm)
   * @param {Number} d distance in mm to move down
   * @returns {Printer} Reference to this object for chaining
   */
  async down(t) {
    return this.up(-t);
  }
  /**
   * Draw downwards in mm
   * @param {Number} d distance in mm to draw downwards to
   * @returns {Printer} Reference to this object for chaining
   */
  async drawdown(t) {
    return this.drawup(-t);
  }
  // shortcut
  async dd(t) {
    return this.drawdown(t);
  }
  /**
   * Set the direction of movement for the next operation.
   * TODO: This doesn't work with other commands.  Need to implement roll, pitch, yaw?
   * @param {float} angle elevation angle (in z direction, in degrees) for next movement
   * @param {Boolean} radians use radians or not
   * @returns {Printer} reference to this object for chaining
   */
  elevation(t, e = !1) {
    return e || (t = this.d2r(t)), this._elevation = t, this;
  }
  /**
   * Shortcut for elevation.
   * @see elevation
   * @param {any} _elev elevation
   * @returns {Printer} reference to this object for chaining
   */
  elev(t) {
    return this.elevation(t);
  }
  /**
   * Shortcut for elevation.
   * @see elevation
   * @param {any} _elev elevation angle to tilt (degrees). 90 is up, -90 is down
   * @returns {Printer} reference to this object for chaining
   */
  tilt(t) {
    return this.elevation(t);
  }
  /**
   * Set the distance of movement for the next operation.
   * @param {float} d distance to move next time
   * @returns {Printer} reference to this object for chaining
   */
  distance(t) {
    return this._distance = t, this;
  }
  /**
   * Shortcut to distance()
   * @param {float} d distance to move next time
   * @returns {Printer} reference to this object for chaining
   */
  dist(t) {
    return this.distance(t);
  }
  /**
   * Execute a travel based on the internally-set direction/elevation/distance, with an optional time-based function.
   * @param {Number or Object} args Optional: if a non-zero number, extrude
   * the amount specified in mm, or left out then the stored distance set
   * by dist().
   * @returns {Printer} reference to this object for chaining
   */
  async travel(t) {
    const e = this.totalMoveTime;
    let i = 0;
    const r = t && isFinite(t) ? t : this._distance, s = { speed: this._travelSpeed };
    this._distance = 0;
    let h = 800;
    for (; h && i < r; ) {
      h--;
      const m = performance.now(), v = this.totalMoveTime - e, g = this.x, x = this.y, f = this.z, l = this._timeWarp({
        dt: this._intervalTime,
        t: v,
        tt: this.totalMoveTime
      }), u = Math.min(this.t2mm(l), r - i);
      let d = 0, a = u, { d: n, heading: w, elevation: y } = this._warp({
        d: u,
        heading: this._heading,
        elevation: this._elevation,
        t: v,
        tt: this.totalMoveTime
      });
      if (u + y < 1e-5) break;
      a = n, Math.abs(y) > Number.EPSILON && (a = n * Math.cos(y), d = n * Math.sin(y)), s.x = g + a * Math.cos(w), s.y = x + a * Math.sin(w), s.z = f + d, await this.moveto(s), i += u, Logger.debug(
        `Moved ${u} to ${i} towards ${r}`
      ), Logger.debug(
        `Move time warp op (${l}) took ${performance.now() - m} ms vs. expected ${this._intervalTime}.`
      );
    }
    return this._elevation = 0, this;
  }
  /**
   * Execute an travel for a specific amount of time and optionally apply a time-based function to warp the movement (x, y, z, e, speed, etc).
   * @param {Number or String} time If a non-zero number, extrude for the time specified in ms, or if a String parse the suffix for b=beats, s=seconds, ms=milliseconds (e.g. "20ms")
   * @returns {Printer} reference to this object for chaining
   */
  async traveltime(t) {
    const e = this.totalMoveTime;
    let i = 0, r = 0;
    const s = { speed: this._travelSpeed };
    try {
      i = this.parseAsTime(t);
    } catch (m) {
      throw m;
    }
    i += this.totalMoveTime, this._distance = 0;
    let h = 2e4;
    for (; h && this.totalMoveTime < i; ) {
      h--;
      const m = performance.now(), v = this.x, g = this.y, x = this.z, f = this.totalMoveTime - e, l = this._timeWarp({
        dt: this._intervalTime,
        t: f,
        tt: this.totalMoveTime
      }), u = this.t2mm(l);
      let d = 0, a = u, { d: n, heading: w, elevation: y } = this._warp({
        d: u,
        heading: this._heading,
        elevation: this._elevation,
        t: f,
        tt: this.totalMoveTime
      });
      a = n, r += n, Math.abs(y) > Number.EPSILON && (a = n * Math.cos(y), d = n * Math.sin(y)), Logger.debug(`Moved ${n} over (${l} ms) to ${r}}`), s.x = v + a * Math.cos(w), s.y = g + a * Math.sin(w), s.z = x + d, await this.moveto(s), Logger.debug(
        `Move time warp op took ${performance.now() - m} ms vs. expected ${this._intervalTime}.`
      );
    }
    return this;
  }
  /**
   * Set firmware retraction on or off (for after every move).
   * @param {Boolean} state True if on, false if off
   * @returns {Printer} this printer object for chaining
   */
  async fwretract(t) {
    return this.firmwareRetract = t, this.fwretract ? await this.gcodeEvent("M209 S0") : await this.gcodeEvent("M209 S1"), this;
  }
  /**
   * Extrude a polygon starting at the current point on the curve (without retraction)
   * @param {any} r radius
   * @param {any} segs segments (more means more perfect circle)
   */
  async polygon(t, e = 10) {
    const i = t * t * 2, r = Math.PI * 2 / e, s = Math.sqrt(i - i * Math.cos(r)), h = this._autoRetract;
    this._autoRetract = !1;
    for (let m = 0; m < e; m++)
      this.turn(r, !0), await this.draw(s);
    return this._autoRetract = h, this._autoRetract && await this.retract(), this;
  }
  /**
   * Extrude a rectangle with the current point as its centre
   * @param {any} w width
   * @param {any} h height
   * @returns {Printer} reference to this object for chaining
   */
  async rect({ w: t, h: e }) {
    const i = this._autoRetract;
    this._autoRetract = !1;
    const r = t || e, s = e || t;
    for (let h = 0; h < 2; h++)
      await this.draw(r), this.turn(90), await this.draw(s), this.turn(90);
    return this._autoRetract = i, await this.retract(), await this.travel(r), this;
  }
  /**
   * Extrude plastic from the printer head to specific coordinates, within printer bounds
   * @param {Object} params Parameters dictionary containing either:
   * - x,y,z,e keys referring to movement and filament position
   * - 'retract' for manual retract setting (true/false)
   * - 'speed' for the print or travel speed of this and subsequent operations
   * - 'thickness' or 'thick' for setting/updating layer height
   * - 'bounce' if movement should bounce off sides (true/false), not currently implemented properly
   * @returns {Printer} reference to this object for chaining
   */
  async extrudeto(t) {
    const e = t.e === void 0, i = t.x !== void 0 ? parseFloat(t.x) : this.x, r = t.y !== void 0 ? parseFloat(t.y) : this.y, s = t.z !== void 0 ? parseFloat(t.z) : this.z, h = t.e !== void 0 ? parseFloat(t.e) : this.e, m = Math.abs(h - this.e) > 1e-4, v = e || m, g = e && m && (t.retract === !0 || t.retract === void 0 && this._autoRetract);
    !e && m && (this.currentRetraction = 0), g && await this.unretract();
    let x = new Vector({ x: i, y: r, z: s, e: h }), f = parseFloat(
      t.speed !== void 0 ? t.speed : v ? this._printSpeed : this._travelSpeed
    );
    this.layerHeight = parseFloat(
      t.thickness !== void 0 ? t.thickness : this.layerHeight
    ), t.thick !== void 0 && (this.layerHeight = parseFloat(t.thick));
    const l = Vector.sub(x, this.position), u = new Vector(
      l.axes.x,
      l.axes.y,
      l.axes.z
    );
    let d, a;
    if (d = u.mag(), !m && d < Number.EPSILON) return;
    if (d < 1e-4 ? a = 1e3 * l.axes.e / f : a = 1e3 * d / f, Number.isNaN(a))
      throw new Error("Movetime NAN in extrudeTo");
    if (e) {
      Logger.debug(`moveTime: ${a}`);
      const y = this._filamentDiameter / 2;
      let P = d * this.layerHeight * this.layerHeight;
      if (P > this.maxFilamentPerOperation)
        throw Error("[API] Too much filament in move:" + P);
      this._extrusionInmm3 || (P /= y * y * Math.PI), l.axes.e = P, x.axes.e = this.e + l.axes.e;
    }
    if (x = this.clipToPrinterBounds(x.axes), this.totalMoveTime += a, Logger.debug("time: " + a + " / dist:" + d), a > this.maxTimePerOperation)
      throw new Error("[API] move time too long:" + a);
    if (a < 1e-3)
      throw this.errorEvent("[API] total move time too short:" + a), new Error("[API] move time too short:" + a);
    const n = Vector.div(l, a / 1e3);
    if (Logger.debug(n), v) {
      if (Math.abs(n.axes.x) > this._maxPrintSpeed.x)
        throw Error("[API] X printing speed too fast:" + n.axes.x);
      if (Math.abs(n.axes.y) > this._maxPrintSpeed.y)
        throw Error("[API] Y printing speed too fast:" + n.axes.y);
      if (Math.abs(n.axes.z) > this._maxPrintSpeed.z)
        throw Error("[API] Z printing speed too fast:" + n.axes.z);
      if (Math.abs(n.axes.e) > this._maxPrintSpeed.e)
        throw Error(
          "[API] E printing speed too fast:" + n.axes.e + "/" + this._maxPrintSpeed.e
        );
    } else {
      if (Math.abs(n.axes.x) > this._maxTravelSpeed.x)
        throw Error("[API] X travel too fast:" + n.axes.x);
      if (Math.abs(n.axes.y) > this._maxTravelSpeed.y)
        throw Error("[API] Y travel too fast:" + n.axes.y);
      if (Math.abs(n.axes.z) > this._maxTravelSpeed.z)
        throw Error("[API] Z travel too fast:" + n.axes.z);
    }
    const w = { ...this.position.axes };
    this.position.set(x), await this.sendExtrusionGCode(f), v ? this.printEvent({
      type: "extrude",
      newPosition: { ...this.position.axes },
      oldPosition: { ...w },
      speed: this._printSpeed,
      moveTime: a,
      totalMoveTime: this.totalMoveTime,
      layerHeight: this.layerHeight,
      length: d
    }) : this.printEvent({
      type: "travel",
      newPosition: { ...this.position.axes },
      oldPosition: { ...w },
      speed: this._travelSpeed,
      moveTime: a,
      totalMoveTime: this.totalMoveTime,
      layerHeight: this.layerHeight,
      length: d
    }), g && await this.retract();
  }
  // end extrudeto
  /**
   * Send movement update GCode to printer based on current position (this.x,y,z).
   * */
  async sendExtrusionGCode(t) {
    this.e = parseFloat(this.e.toFixed(4)), this.x = parseFloat(this.x.toFixed(4)), this.y = parseFloat(this.y.toFixed(4)), this.z = parseFloat(this.z.toFixed(4));
    let e = ["G1"];
    return e.push("X" + this.x), e.push("Y" + this.y), e.push("Z" + this.z), e.push("E" + this.e), e.push("F" + (t * 60).toFixed(4)), await this.gcodeEvent(e.join(" ")), this;
  }
  // end sendExtrusionGCode
  /**
   * Send movement update GCode to printer based on current position (this.x,y,z).
   * @param {Int} speed print speed in mm/s
   * @param {boolean} retract if true (default) add GCode for retraction/unretraction. Will use either hardware or software retraction if set in Printer object
   * */
  async sendArcExtrusionGCode(t, e = !0, i = !0) {
    let r = clockwise ? ["G2"] : ["G3"];
    return r.push("X" + this.x.toFixed(4)), r.push("Y" + this.y.toFixed(4)), r.push("Z" + this.z.toFixed(4)), r.push("E" + this.e.toFixed(4)), r.push("F" + (t * 60).toFixed(4)), await this.gcodeEvent(r.join(" ")), this.e = parseFloat(this.e.toFixed(4)), this.x = parseFloat(this.x.toFixed(4)), this.y = parseFloat(this.y.toFixed(4)), this.z = parseFloat(this.z.toFixed(4)), this;
  }
  // end sendArcExtrusionGCode
  // TODO: have this chop up moves and call a callback function each time,
  // like in _extrude
  //
  // call movement callback function with this lp object
  // if(that.moveCallback)
  //        that.moveCallback(that);
  /**
   * Extrude plastic from the printer head, relative to the current print head position,
   *  within printer bounds
   * @param {Object} params Parameters dictionary containing x,y,z,e keys
   * @returns {Printer} reference to this object for chaining
   */
  async extrude(t) {
    let e = {};
    return e.x = t.x !== void 0 ? parseFloat(t.x) + this.x : this.x, e.y = t.y !== void 0 ? parseFloat(t.y) + this.y : this.y, e.z = t.z !== void 0 ? parseFloat(t.z) + this.z : this.z, e.e = t.e !== void 0 ? parseFloat(t.e) + this.e : void 0, e.retract = t.retract, e.speed = t.speed, this.extrudeto(e);
  }
  // end extrude
  /**
   * Relative movement.
   * @param {any} params Can be specified as x,y,z  in mm.
   * @returns {Printer} reference to this object for chaining
   */
  async move(t) {
    let e = {};
    return e.x = t.x !== void 0 ? parseFloat(t.x) + this.x : this.x, e.y = t.y !== void 0 ? parseFloat(t.y) + this.y : this.y, e.z = t.z !== void 0 ? parseFloat(t.z) + this.z : this.z, e.e = this.e, t.speed !== void 0 && this.travelspeed(parseFloat(t.speed)), e.speed = this._travelSpeed, this.extrudeto(e);
  }
  // end move
  /**
   * Absolute movement.
   * @param {any} params Can be specified as x,y,z. All in mm.
   * @returns {Printer} reference to this object for chaining
   */
  async moveto(t) {
    return t.e = this.e, t.speed = t.speed === void 0 ? this._travelSpeed : parseFloat(t.speed), this._travelSpeed = t.speed, this.extrudeto(t);
  }
  /**
   * Turn (clockwise positive, CCW negative)
   * @param {Number} angle in degrees by default
   * @param {Boolean} radians use radians if true
   * @returns {Printer} reference to this object for chaining
   * @example
   * Turn 45 degrees twice (so 90 total) and extrude 40 mm in that direction:
   * lp.turn(45).turn(45).distance(40).draw();
   */
  turn(t, e = !1) {
    let i = t;
    return e || (i = this.d2r(t)), this._heading += i, this;
  }
  /**
   * Fill a rectagular area (lines drawn parallel to direction).
   * @param {Number} w width
   * @param {Number} h height
   * @param {Number} gap gap between fills
   */
  async drawfill(t, e, i) {
    i === void 0 && (i = 1.5 * this.layerHeight);
    const r = this._autoRetract;
    this._autoRetract = !1, o;
    let s = t / i;
    if (s < 3)
      await this.draw(e);
    else {
      s % 2 !== 0 && (s += 1);
      for (let h = 0; h < s; h++) {
        let m = h % 2 === 0 ? -1 : 1;
        await this.draw(e), this.turn(m * 90), await this.draw(i), this.turn(m * 90);
      }
      this.turn(180);
    }
    return this._autoRetract = r, this._autoRetract && await this.retract(), this;
  }
  /**
   * Synchronise variables like position and temp
   */
  async sync() {
    return await this.gcodeEvent("M105"), await this.gcodeEvent("M114"), this;
  }
  /**
   * Degrees to radians conversion.
   * @param {float} angle in degrees
   * @returns {float} angle in radians
   */
  d2r(t) {
    return Math.PI * t / 180;
  }
  /**
   * Radians to degrees conversion.
   * @param {float} angle in radians
   * @returns {float} angle in degrees
   */
  r2d(t) {
    return t * 180 / Math.PI;
  }
  /**
   * Convert MIDI notes and duration into direction and angle for future movement.
   * Low notes below 10 are treated a pauses.
   * @param {float} note as midi note
   * @param {float} time in ms
   * @param {string} axes move direction as x,y,z (default "x")
   * @returns {Printer} reference to this object for chaining
   * @example
   * Play MIDI note 41 for 400ms on the x & y axes
   *     lp.note(41, 400, "xy").travel();
   */
  note(t = 40, e = 200, i = "x") {
    const r = [];
    r.push(...i);
    let s = 0, h = 0, m = 0, v = 0;
    for (const g of r)
      if (t < 10) {
        this._waitTime = e;
        break;
      } else {
        let x = this.midi2speed(t, g);
        s += x * x, g === "x" ? this._heading < Math.PI / 2 && this._heading > -Math.PI / 2 ? m = -90 : m = 90 : g === "y" ? this._heading > 0 && this._heading < Math.PI ? h = 90 : h = -90 : g === "z" && (this._elevation > 0 ? v = Math.PI / 2 : v = -Math.PI / 2);
      }
    return this._heading = Math.atan2(h, m), this._elevation = v, this._distance = this.printpeed(Math.sqrt(s)) * e / 1e3, this;
  }
  /**
   * Set the movement distance based on a target amount of time to move. (Uses current print speed to calculate)
   * @param {Number} time Time to move in milliseconds
   * @returns {Printer} reference to this object for chaining
   */
  t2d(t, e = this._travelSpeed) {
    const i = this.parseAsTime(t), r = this.parseAsTime(e);
    return this._distance = this.t2mm(i, r), this;
  }
  /**
   * Calculate the movement distance based on a target amount of time to move. (Uses current print speed to calculate)
   * @param {Number or String} time Time in string or number format to move
   * @returns {Number or String} distance in mm
   */
  t2mm(t, e = this._printSpeed) {
    const i = this.parseAsTime(t);
    return this.parseAsTime(e) * i / 1e3;
  }
  /**
   * Calculate the movement distance based on a midi note and the current bpm.
   * @param {String or Number} note as midi note in string ("C6") or numeric (68) format
   * @param {Number or String} time Time in string or number format to move
   * @param {Number} bpm Beats per minute
   * @returns {Number or String} distance in mm
   */
  n2mm(t, e = "1b", i = this._bpm) {
    const r = this.midi2speed(t), s = this.parseAsTime(e, i);
    return r * s / 1e3;
  }
  /**
   * Get the time in ms based on number of beats (uses bpm to calculate)
   * @param {String or Number} beats Beats (or any time really) as a time string or number
   * @param {Number} bpm Beats per minute
   * @returns {Number} Time in ms equivalent to the number of beats
   */
  b2t(t, e = this._bpm) {
    return this.parseAsTime(t, e);
  }
  /**
   * Simple function to calculate the expected time of a movement (without retraction)
   * @param {Number} _dist Distance of movement in mm
   * @param {Number} _speed Speed of movement in mm/s
   * @returns {Number} time of movement in ms
   */
  d2t(t = this._distance, e = this._printSpeed) {
    return Math.abs(t) * e;
  }
  /**
   * Fills an area based on layerHeight (as thickness of each line)
   * @param {float} w width of the area in mm
   * @param {float} h height of the area in mm
   * @param {float} lh the layerheight (or gap, if larger)
   * @returns {Printer} reference to this object for chaining
   */
  async fill(t, e, i = this.layerHeight) {
    let r = i * Math.PI;
    for (var s = 0, h = 0; h < e; s++, h += r) {
      let m = s % 2 === 0 ? 1 : -1;
      await this.move({ y: r }), await this.extrude({ x: m * t });
    }
    return this;
  }
  /**
   * @param {String or Number} note as midi note in string ("C6") or numeric (68) format
   * @param {string} axis of movement: x,y,z
   * @returns {float} speed in mm/s
   */
  midi2speed(t, e = "x") {
    let i = isNaN(t) ? Note.midi(t) : t;
    return Math.pow(2, (i - 69) / 12) * 440 / parseFloat(this.speedScale()[e]);
  }
  /**
   * Calculate and set both the travel and print speed in mm/s based on midi note
   * @param {float} note midi note
   * @param {string} axis axis (x,y,z,e) of movement
   * @returns {float} new speed
   */
  m2s(t, e = "x") {
    return this.travelspeed(this.printspeed(this.midi2speed(t, e)));
  }
  /**
   * Convenience function for getting speed scales for midi notes from printer model.
   * @returns {object} x,y,z speed scales
   */
  speedScale() {
    let t = this._speedScale;
    return { x: t.x, y: t.y, z: t.z };
  }
  /**
   * Causes the printer to wait for a number of milliseconds
   * @param {float} ms to wait
   * @returns {Printer} reference to this object for chaining
   */
  async wait(t = this._waitTime) {
    return await this.gcodeEvent("G4 P" + t), this._waitTime = 0, this;
  }
  /**
   * Temporarily pause the printer: move the head up, turn off fan & temp
   * @returns {Printer} reference to this object for chaining
   */
  async pause() {
    return await this.extrude({ e: -16, speed: 250 }), await this.move({ z: -3 }), await this.gcodeEvent("M104 S0"), await this.gcodeEvent("M107 S0"), this;
  }
  /**
   * Resume the printer printing: turn on fan & temp
   * @param {float} temp target temp
   * @returns {Printer} reference to this object for chaining
   */
  async resume(t = "190") {
    return await this.gcodeEvent("M109 S" + t), await this.gcodeEvent("M106 S100"), await this.extrude({ e: 16, speed: 250 }), this;
  }
  /**
     * Print paths 
     * @param {Array} paths List of paths (lists of coordinates in x,y) to print
     * @param {Object} settings Settings for the scaling, etc. of this object. useaspect means respect aspect ratio (width/height). A width or height
     * of 0 means to use the original paths' width/height.
     * @returns {Printer} reference to this object for chaining
     * @test const p = [
     *     [20,20],
           [30,30],
           [50,30]];
        lp.printPaths({paths:p,minZ:0.2,passes:10});
     */
  async printPaths({
    paths: t = [[]],
    y: e = 0,
    x: i = 0,
    z: r = 0,
    w: s = 0,
    h = 0,
    useaspect: m = !0,
    passes: v = 1,
    safeZ: g = 0
  }) {
    g = g || this.layerHeight * v + 10;
    let x = 1 / 0, f = 1 / 0, l = -1 / 0, u = -1 / 0, d = t.length;
    for (; d--; ) {
      let p = t[d].length, c = {
        x: 1 / 0,
        y: 1 / 0,
        x2: -1 / 0,
        y2: -1 / 0,
        area: 0
      };
      for (; p--; )
        x = Math.min(t[d][p][0], x), f = Math.min(t[d][p][1], f), l = Math.max(t[d][p][0], l), u = Math.max(t[d][p][1], u), t[d][p][0] < c.x && (c.x = t[d][p][0]), t[d][p][1] < c.y && (c.y = t[d][p][0]), t[d][p][0] > c.x2 && (c.x2 = t[d][p][0]), t[d][p][1] > c.y2 && (c.y2 = t[d][p][0]);
      c.area = (1 + c.x2 - c.x) * (1 + c.y2 - c.y), t[d].bounds = c;
    }
    const a = l - x, n = u - f, w = s && h, y = s || h;
    if (!w)
      if (y)
        if (s > 0) {
          const p = n / a;
          h = s * p;
        } else {
          const p = a / n;
          s = h * p;
        }
      else
        s = a, h = n;
    const P = makeMapping([x, l], [i, i + s]), T = makeMapping([f, u], [e, e + h]);
    t.sort(function(p, c) {
      return p.bounds.x < c.bounds.x ? -1 : 1;
    });
    for (let p = 0, c = t.length; p < c; p++) {
      let _ = t[p].slice();
      for (let S = 1; S <= v; S++) {
        const M = S * this.layerHeight + r;
        await this.moveto({
          x: P(_[0][0]),
          y: T(_[0][1])
        }), await this.moveto({ z: M }), await this.unretract();
        for (let b = 0, z = _.length; b < z; b++) {
          const E = _[b];
          await this.extrudeto({
            x: P(E[0]),
            y: T(E[1]),
            retract: !1
          });
        }
        S < v ? _.reverse() : (await this.retract(), await this.moveto({ z: g }));
      }
    }
    return this;
  }
  /**
         * Print paths using drawFill. NEVER TESTED!
         * @param {Array} paths List of paths (lists of coordinates in x,y) to print
         * @param {Object} settings Settings for the scaling, etc. of this object. useaspect means respect aspect ratio (width/height). A width or height
         * of 0 means to use the original paths' width/height.
         * @returns {Printer} reference to this object for chaining
         * @test const p = [
         *     [20,20],
               [30,30],
               [50,30]];
            lp.printPaths({paths:p,minZ:0.2,passes:10});
         */
  async printPathsThick({
    paths: t = [[]],
    y: e = 0,
    x: i = 0,
    z: r = 0,
    w: s = 0,
    h = 0,
    t: m = 1,
    useaspect: v = !0,
    passes: g = 1,
    safeZ: x = 0
  }) {
    x = x || this.layerHeight * g + 10, m = this.layerHeight * 2.5 * m;
    let f = 1 / 0, l = 1 / 0, u = -1 / 0, d = -1 / 0, a = t.length;
    for (; a--; ) {
      let c = t[a].length, _ = {
        x: 1 / 0,
        y: 1 / 0,
        x2: -1 / 0,
        y2: -1 / 0,
        area: 0
      };
      for (; c--; )
        f = Math.min(t[a][c][0], f), l = Math.min(t[a][c][1], l), u = Math.max(t[a][c][0], u), d = Math.max(t[a][c][1], d), t[a][c][0] < _.x && (_.x = t[a][c][0]), t[a][c][1] < _.y && (_.y = t[a][c][0]), t[a][c][0] > _.x2 && (_.x2 = t[a][c][0]), t[a][c][1] > _.y2 && (_.y2 = t[a][c][0]);
      t[a].bounds = _;
    }
    const n = u - f, w = d - l, y = s && h, P = s || h;
    if (!y)
      if (P)
        if (s > 0) {
          const c = w / n;
          h = s * c;
        } else {
          const c = n / w;
          s = h * c;
        }
      else
        s = n, h = w;
    const T = makeMapping([f, u], [i, i + s]), p = makeMapping([l, d], [e, e + h]);
    t.sort(function(c, _) {
      return c.bounds.x < _.bounds.x ? -1 : 1;
    });
    for (let c = 1; c <= g; c++)
      for (let _ = 0, S = t.length; _ < S; _++) {
        let M = t[_].slice();
        const b = c * this.layerHeight + r;
        if (await this.moveto({
          x: T(M[0][0]),
          y: p(M[0][1])
        }), await this.moveto({ z: b }), M.length > 1) {
          let z = 0, E = 0, I = T(M[0][0]), A = p(M[0][1]), R = Math.atan2(
            p(M[1][1]) - A,
            T(M[1][0]) - I
          );
          for (let L = 1, N = M.length; L < N; L++) {
            const H = M[L], C = T(H[0]), U = p(H[1]), $ = C - I, k = U - A, F = Math.atan2(k, $);
            F !== R ? (await this.drawfill(z || 2, E || 2, m), z = E = 0, this.turn(F), R = F) : (z += $, E += k);
          }
        }
        c < g ? M.reverse() : await this.moveto({ z: x });
      }
    return this;
  }
}
export {
  LivePrinter
};
