var U = Object.defineProperty;
var G = (t, e, i) => e in t ? U(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var R = (t, e, i) => G(t, typeof e != "symbol" ? e + "" : e, i);
class Logger {
  // default
  static debug(e) {
  }
  static info(e) {
  }
  static warning(e) {
  }
  static error(e) {
    console.error(e);
  }
}
R(Logger, "LOG_LEVEL", {
  error: 0,
  warning: 1,
  info: 2,
  debug: 3
}), R(Logger, "level", 0);
class Vector {
  constructor(e) {
    if (this.axes = {}, arguments.length > 1)
      this.axes.x = arguments[0], this.axes.y = arguments[1], arguments.length > 2 && (this.axes.z = arguments[2]), arguments.length > 3 && (this.axes.e = arguments[3]);
    else if (e !== void 0) {
      if (e instanceof Vector)
        for (const i in e.axes)
          this.axes[i] = e.axes[i];
      else if (e instanceof Object)
        for (const i in e)
          this.axes[i] = e[i];
    } else
      this.axes.x = 0, this.axes.y = 0, this.axes.z = 0;
  }
  /**
   * Subtract a vector object (x,y,z,e or whatever) from another and return a new vector.
   * TODO: Consider using toxiclibs or other Vector lib
   * @param {Vector} v0 first vector 
   * @returns {object} reference to this for chaining
   */
  subSelf(e) {
    try {
      for (const i in e.axes)
        this.axes[i] = this.axes[i] - e.axes[i];
    } catch (i) {
      throw i;
    }
    return this;
  }
  /**
   * Add a vector object (x,y,z,e or whatever) to another and return itself.
   * @param {Vector} v0 amount to add
   * @returns {object} reference to this for chaining
   */
  addSelf(e) {
    try {
      for (const i in e.axes)
        this.axes[i] = this.axes[i] + e[i];
    } catch (i) {
      throw i;
    }
    return this;
  }
  /**
   * Magnitude squared of this vector as a scalar.
   * @returns {float} magnitude
   */
  magSq() {
    let e = 0;
    for (const i in this.axes)
      e += this.axes[i] * this.axes[i];
    return e;
  }
  /**
   * Magnitude of this vector as a scalar.
   * @returns {float} magnitude
   */
  mag() {
    return Math.sqrt(this.magSq());
  }
  /**
   * Scalar distance between Vectors.
   * @param {Vector} v0 (required) first vector 
   * @returns {float} scalar vector
   */
  distSelf(e) {
    return Vector.sub(this, e).mag();
  }
  /**
   * Scalar distance between Vectors.
   * @param {Vector} v0 (required) first vector 
   * @param {Vector} v1 (optional) second vector (if not included, will use this)
   * @returns {float} scalar vector
   */
  static dist(e, i) {
    return Vector.sub(e, i).mag();
  }
  /**
   * Divide a vector by a scalar
   * @param {Number} amt to divide by
   * @returns {Vector} this object for chaining
   */
  divSelf(e) {
    for (const i in this.axes)
      this.axes[i] /= e;
    return this;
  }
  /**
   * Multiply a vector by a scalar
   * @param {Number} amt to multiply by
   * @returns {Vector} this object for chaining
   */
  multSelf(e) {
    for (const i in this.axes)
      this.axes[i] *= e;
    return this;
  }
  /**
   * Set the properties of this Vector based on another or a mapping object
   * @param {object} mapping object with fields to deep copy into this Vector
   * @returns {Vector} this object for chaining
   */
  set(e) {
    if (e !== void 0) {
      if (e instanceof Vector)
        for (const i in e.axes)
          this.axes[i] = e.axes[i];
      else if (e instanceof Object)
        for (const i in e)
          this.axes[i] = e[i];
    }
    return this;
  }
  /**
   * Add a vector object (x,y,z,e or whatever) to another and return a new Vector.
   * TODO: Consider using toxiclibs or other Vector lib
   * @param {Vector} v0 first vector 
   * @param {Vector} v1 amount to add
   * @returns {object} reference to this for chaining
   */
  static add(e, i) {
    const r = new Vector();
    try {
      for (const s in e.axes)
        r.axes[s] = e.axes[s] + i.axes[s];
    } catch (s) {
      throw s;
    }
    return r;
  }
  /**
  * Divide a vector object (x,y,z,e or whatever) by an amount and return a new one.
  * @param {Vector} v0 first vector 
  * @param {number} amt amount to divide by
  * @returns {Vector} new Vector
  */
  static div(e, i) {
    const r = new Vector();
    try {
      for (const s in e.axes)
        r.axes[s] = e.axes[s] / i;
    } catch (s) {
      throw s;
    }
    return r;
  }
  /**
  * Subtract a vector object (x,y,z,e or whatever) from another and return a new vector.
  * @param {Vector} v0 first vector 
  * @param {Vector} v1 amount to subtract
  * @returns {Vector} result vector
  */
  static sub(e, i) {
    const r = new Vector();
    try {
      for (const s in e.axes)
        r.axes[s] = e.axes[s] - i.axes[s];
    } catch (s) {
      throw s;
    }
    return r;
  }
  /**
  * Multiply a vector object (x,y,z,e or whatever) to another and return a new vector.
  * @param {Vector} v0 first vector 
  * @param {Vector} v1 second vector
  * @returns {Vector} result vector 
  */
  static mult(e, i) {
    const r = new Vector();
    if (typeof i == "object")
      try {
        for (const s in e.axes)
          r.axes[s] = e.axes[s] * i.axes[s];
      } catch (s) {
        throw s;
      }
    else if (typeof i == "number")
      try {
        for (const s in e.axes)
          r.axes[s] = e.axes[s] * i;
      } catch (s) {
        throw s;
      }
    return r;
  }
  /**
   * 
   * @param {Vector} v1 
   * @param {Vector} v2 
   * @returns {Number} dot product (scalar)
   */
  static dot(e, i) {
    return e.axes.x * i.axes.x + e.axes.y * i.axes.y + (e.axes.z || 0) * (i.axes.z || 0);
  }
  /**
   * 
   * @param {Vector} v1 
   * @param {Vector} v2 
   * @returns {Vector} cross product
   */
  static cross(e, i) {
    const r = e.axes.y * (i.axes.z || 0) - (e.axes.z || 0) * i.axes.y, s = (e.axes.z || 0) * i.axes.x - e.axes.x * (i.axes.z || 0), n = e.axes.x * i.axes.y - e.axes.y * i.axes.x;
    return new Vector(r, s, n);
  }
  /**
   * 
   * @param {Vector} v1
   * @param {Vector} v2 
   * @returns {Number} angle between in radians
   */
  static angleBetween(e, i) {
    const r = Vector.dot(e, i) / (e.mag() * i.mag());
    let s;
    return s = Math.acos(Math.min(1, Math.max(-1, r))), s = s * Math.sign(Vector.cross(e, i).axes.z || 1), s;
  }
}
String.prototype.reverse = function() {
  const t = /([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g, e = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;
  let i = this.replace(t, function(n, d, l) {
    return l.reverse() + d;
  }).replace(e, "$2$1"), r = "", s = i.length;
  for (; s--; )
    r += i.charAt(s);
  return r;
};
var NAMES = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B".split(" "), names = function(t) {
  return typeof t != "string" ? NAMES.slice() : NAMES.filter(function(e) {
    var i = e[1] || " ";
    return t.indexOf(i) !== -1;
  });
};
names(" #");
names(" b");
var REGEX$2 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
function tokenize$1(t) {
  typeof t != "string" && (t = "");
  var e = REGEX$2.exec(t);
  return [e[1].toUpperCase(), e[2].replace(/x/g, "##"), e[3], e[4]];
}
var NO_NOTE = Object.freeze({
  pc: null,
  name: null,
  step: null,
  alt: null,
  oct: null,
  octStr: null,
  chroma: null,
  midi: null,
  freq: null
}), SEMI = [0, 2, 4, 5, 7, 9, 11], properties$1 = function(t) {
  var e = tokenize$1(t);
  if (e[0] === "" || e[3] !== "")
    return NO_NOTE;
  var i = e[0], r = e[1], s = e[2], n = {
    letter: i,
    acc: r,
    octStr: s,
    pc: i + r,
    name: i + r + s,
    step: (i.charCodeAt(0) + 3) % 7,
    alt: r[0] === "b" ? -r.length : r.length,
    oct: s.length ? +s : null,
    chroma: 0,
    midi: null,
    freq: null
  };
  return n.chroma = (SEMI[n.step] + n.alt + 120) % 12, n.midi = n.oct !== null ? SEMI[n.step] + n.alt + 12 * (n.oct + 1) : null, n.freq = midiToFreq(n.midi), Object.freeze(n);
}, memo = function(t, e) {
  return e === void 0 && (e = {}), function(i) {
    return e[i] || (e[i] = t(i));
  };
}, props$1 = memo(properties$1), isMidiRange = function(t) {
  return t >= 0 && t <= 127;
}, midi = function(t) {
  if (typeof t != "number" && typeof t != "string")
    return null;
  var e = props$1(t).midi, i = e || e === 0 ? e : +t;
  return isMidiRange(i) ? i : null;
}, midiToFreq = function(t, e) {
  return e === void 0 && (e = 440), typeof t == "number" ? Math.pow(2, (t - 69) / 12) * e : null;
}, chroma$2 = function(t) {
  return props$1(t).chroma;
}, IVL_TNL = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})", IVL_STR = "(AA|A|P|M|m|d|dd)([-+]?\\d+)", REGEX$1 = new RegExp("^" + IVL_TNL + "|" + IVL_STR + "$"), SIZES = [0, 2, 4, 5, 7, 9, 11], TYPES = "PMMPPMM", tokenize = function(t) {
  var e = REGEX$1.exec("" + t);
  return e === null ? null : e[1] ? [e[1], e[2]] : [e[4], e[3]];
}, NO_IVL = Object.freeze({
  name: null,
  num: null,
  q: null,
  step: null,
  alt: null,
  dir: null,
  type: null,
  simple: null,
  semitones: null,
  chroma: null,
  oct: null
}), qToAlt = function(t, e) {
  return e === "M" && t === "M" || e === "P" && t === "P" ? 0 : e === "m" && t === "M" ? -1 : /^A+$/.test(e) ? e.length : /^d+$/.test(e) ? t === "P" ? -e.length : -e.length - 1 : null;
}, numToStep = function(t) {
  return (Math.abs(t) - 1) % 7;
}, properties = function(t) {
  var e = tokenize(t);
  if (e === null)
    return NO_IVL;
  var i = {
    num: 0,
    q: "d",
    name: "",
    type: "M",
    step: 0,
    dir: -1,
    simple: 1,
    alt: 0,
    oct: 0,
    semitones: 0,
    chroma: 0,
    ic: 0
  };
  return i.num = +e[0], i.q = e[1], i.step = numToStep(i.num), i.type = TYPES[i.step], i.type === "M" && i.q === "P" ? NO_IVL : (i.name = "" + i.num + i.q, i.dir = i.num < 0 ? -1 : 1, i.simple = i.num === 8 || i.num === -8 ? i.num : i.dir * (i.step + 1), i.alt = qToAlt(i.type, i.q), i.oct = Math.floor((Math.abs(i.num) - 1) / 7), i.semitones = i.dir * (SIZES[i.step] + i.alt + 12 * i.oct), i.chroma = (i.dir * (SIZES[i.step] + i.alt) % 12 + 12) % 12, Object.freeze(i));
}, cache = {};
function props(t) {
  return typeof t != "string" ? NO_IVL : cache[t] || (cache[t] = properties(t));
}
var chroma$1 = function(t) {
  return props(t).chroma;
};
const chromatic = ["1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M"], lydian = ["1P 2M 3M 4A 5P 6M 7M"], major = ["1P 2M 3M 4P 5P 6M 7M", ["ionian"]], mixolydian = ["1P 2M 3M 4P 5P 6M 7m", ["dominant"]], dorian = ["1P 2M 3m 4P 5P 6M 7m"], aeolian = ["1P 2M 3m 4P 5P 6m 7m", ["minor"]], phrygian = ["1P 2m 3m 4P 5P 6m 7m"], locrian = ["1P 2m 3m 4P 5d 6m 7m"], altered = ["1P 2m 3m 3M 5d 6m 7m", ["super locrian", "diminished whole tone", "pomeroy"]], diminished = ["1P 2M 3m 4P 5d 6m 6M 7M", ["whole-half diminished"]], iwato = ["1P 2m 4P 5d 7m"], hirajoshi = ["1P 2M 3m 5P 6m"], kumoijoshi = ["1P 2m 4P 5P 6m"], pelog = ["1P 2m 3m 5P 6m"], prometheus = ["1P 2M 3M 4A 6M 7m"], ritusen = ["1P 2M 4P 5P 6M"], scriabin = ["1P 2m 3M 5P 6M"], piongio = ["1P 2M 4P 5P 6M 7m"], augmented = ["1P 2A 3M 5P 5A 7M"], neopolitan = ["1P 2m 3m 4P 5P 6m 7M"], egyptian = ["1P 2M 4P 5P 7m"], oriental = ["1P 2m 3M 4P 5d 6M 7m"], flamenco = ["1P 2m 3m 3M 4A 5P 7m"], balinese = ["1P 2m 3m 4P 5P 6m 7M"], persian = ["1P 2m 3M 4P 5d 6m 7M"], bebop = ["1P 2M 3M 4P 5P 6M 7m 7M"], enigmatic = ["1P 2m 3M 5d 6m 7m 7M"], ichikosucho = ["1P 2M 3M 4P 5d 5P 6M 7M"], sdata = {
  chromatic,
  lydian,
  major,
  mixolydian,
  dorian,
  aeolian,
  phrygian,
  locrian,
  "melodic minor": ["1P 2M 3m 4P 5P 6M 7M"],
  "melodic minor second mode": ["1P 2m 3m 4P 5P 6M 7m"],
  "lydian augmented": ["1P 2M 3M 4A 5A 6M 7M"],
  "lydian dominant": ["1P 2M 3M 4A 5P 6M 7m", ["lydian b7"]],
  "melodic minor fifth mode": ["1P 2M 3M 4P 5P 6m 7m", ["hindu", "mixolydian b6M"]],
  "locrian #2": ["1P 2M 3m 4P 5d 6m 7m", ["half-diminished"]],
  altered,
  "harmonic minor": ["1P 2M 3m 4P 5P 6m 7M"],
  "phrygian dominant": ["1P 2m 3M 4P 5P 6m 7m", ["spanish", "phrygian major"]],
  "half-whole diminished": ["1P 2m 3m 3M 4A 5P 6M 7m", ["dominant diminished"]],
  diminished,
  "major pentatonic": ["1P 2M 3M 5P 6M", ["pentatonic"]],
  "lydian pentatonic": ["1P 3M 4A 5P 7M", ["chinese"]],
  "mixolydian pentatonic": ["1P 3M 4P 5P 7m", ["indian"]],
  "locrian pentatonic": ["1P 3m 4P 5d 7m", ["minor seven flat five pentatonic"]],
  "minor pentatonic": ["1P 3m 4P 5P 7m"],
  "minor six pentatonic": ["1P 3m 4P 5P 6M"],
  "minor hexatonic": ["1P 2M 3m 4P 5P 7M"],
  "flat three pentatonic": ["1P 2M 3m 5P 6M", ["kumoi"]],
  "flat six pentatonic": ["1P 2M 3M 5P 6m"],
  "major flat two pentatonic": ["1P 2m 3M 5P 6M"],
  "whole tone pentatonic": ["1P 3M 5d 6m 7m"],
  "ionian pentatonic": ["1P 3M 4P 5P 7M"],
  "lydian #5P pentatonic": ["1P 3M 4A 5A 7M"],
  "lydian dominant pentatonic": ["1P 3M 4A 5P 7m"],
  "minor #7M pentatonic": ["1P 3m 4P 5P 7M"],
  "super locrian pentatonic": ["1P 3m 4d 5d 7m"],
  "in-sen": ["1P 2m 4P 5P 7m"],
  iwato,
  hirajoshi,
  kumoijoshi,
  pelog,
  "vietnamese 1": ["1P 3m 4P 5P 6m"],
  "vietnamese 2": ["1P 3m 4P 5P 7m"],
  prometheus,
  "prometheus neopolitan": ["1P 2m 3M 4A 6M 7m"],
  ritusen,
  scriabin,
  piongio,
  "major blues": ["1P 2M 3m 3M 5P 6M"],
  "minor blues": ["1P 3m 4P 5d 5P 7m", ["blues"]],
  "composite blues": ["1P 2M 3m 3M 4P 5d 5P 6M 7m"],
  augmented,
  "augmented heptatonic": ["1P 2A 3M 4P 5P 5A 7M"],
  "dorian #4": ["1P 2M 3m 4A 5P 6M 7m"],
  "lydian diminished": ["1P 2M 3m 4A 5P 6M 7M"],
  "whole tone": ["1P 2M 3M 4A 5A 7m"],
  "leading whole tone": ["1P 2M 3M 4A 5A 7m 7M"],
  "lydian minor": ["1P 2M 3M 4A 5P 6m 7m"],
  "locrian major": ["1P 2M 3M 4P 5d 6m 7m", ["arabian"]],
  neopolitan,
  "neopolitan minor": ["1P 2m 3m 4P 5P 6m 7M"],
  "neopolitan major": ["1P 2m 3m 4P 5P 6M 7M", ["dorian b2"]],
  "neopolitan major pentatonic": ["1P 3M 4P 5d 7m"],
  "romanian minor": ["1P 2M 3m 5d 5P 6M 7m"],
  "double harmonic lydian": ["1P 2m 3M 4A 5P 6m 7M"],
  "harmonic major": ["1P 2M 3M 4P 5P 6m 7M"],
  "double harmonic major": ["1P 2m 3M 4P 5P 6m 7M", ["gypsy"]],
  egyptian,
  "hungarian minor": ["1P 2M 3m 4A 5P 6m 7M"],
  "hungarian major": ["1P 2A 3M 4A 5P 6M 7m"],
  oriental,
  "spanish heptatonic": ["1P 2m 3m 3M 4P 5P 6m 7m"],
  flamenco,
  balinese,
  "todi raga": ["1P 2m 3m 4A 5P 6m 7M"],
  "malkos raga": ["1P 3m 4P 6m 7m"],
  "kafi raga": ["1P 3m 3M 4P 5P 6M 7m 7M"],
  "purvi raga": ["1P 2m 3M 4P 4A 5P 6m 7M"],
  persian,
  bebop,
  "bebop dominant": ["1P 2M 3M 4P 5P 6M 7m 7M"],
  "bebop minor": ["1P 2M 3m 3M 4P 5P 6M 7m"],
  "bebop major": ["1P 2M 3M 4P 5P 5A 6M 7M"],
  "bebop locrian": ["1P 2m 3m 4P 5d 5P 6m 7m"],
  "minor bebop": ["1P 2M 3m 4P 5P 6m 7m 7M"],
  "mystery #1": ["1P 2m 3M 5d 6m 7m"],
  enigmatic,
  "minor six diminished": ["1P 2M 3m 4P 5P 6m 6M 7M"],
  "ionian augmented": ["1P 2M 3M 4P 5A 6M 7M"],
  "lydian #9": ["1P 2m 3M 4A 5P 6M 7M"],
  ichikosucho,
  "six tone symmetric": ["1P 2m 3M 4P 5A 6M"]
}, M = ["1P 3M 5P", ["Major", ""]], M13 = ["1P 3M 5P 7M 9M 13M", ["maj13", "Maj13"]], M6 = ["1P 3M 5P 13M", ["6"]], M69 = ["1P 3M 5P 6M 9M", ["69"]], M7add13 = ["1P 3M 5P 6M 7M 9M"], M7b5 = ["1P 3M 5d 7M"], M7b6 = ["1P 3M 6m 7M"], M7b9 = ["1P 3M 5P 7M 9m"], M7sus4 = ["1P 4P 5P 7M"], M9 = ["1P 3M 5P 7M 9M", ["maj9", "Maj9"]], M9b5 = ["1P 3M 5d 7M 9M"], M9sus4 = ["1P 4P 5P 7M 9M"], Madd9 = ["1P 3M 5P 9M", ["2", "add9", "add2"]], Maj7 = ["1P 3M 5P 7M", ["maj7", "M7"]], Mb5 = ["1P 3M 5d"], Mb6 = ["1P 3M 13m"], Msus2 = ["1P 2M 5P", ["add9no3", "sus2"]], Msus4 = ["1P 4P 5P", ["sus", "sus4"]], Maddb9 = ["1P 3M 5P 9m"], m = ["1P 3m 5P"], m11 = ["1P 3m 5P 7m 9M 11P", ["_11"]], m11b5 = ["1P 3m 7m 12d 2M 4P", ["h11", "_11b5"]], m13 = ["1P 3m 5P 7m 9M 11P 13M", ["_13"]], m6 = ["1P 3m 4P 5P 13M", ["_6"]], m69 = ["1P 3m 5P 6M 9M", ["_69"]], m7 = ["1P 3m 5P 7m", ["minor7", "_", "_7"]], m7add11 = ["1P 3m 5P 7m 11P", ["m7add4"]], m7b5 = ["1P 3m 5d 7m", ["half-diminished", "h7", "_7b5"]], m9 = ["1P 3m 5P 7m 9M", ["_9"]], m9b5 = ["1P 3m 7m 12d 2M", ["h9", "-9b5"]], mMaj7 = ["1P 3m 5P 7M", ["mM7", "_M7"]], mMaj7b6 = ["1P 3m 5P 6m 7M", ["mM7b6"]], mM9 = ["1P 3m 5P 7M 9M", ["mMaj9", "-M9"]], mM9b6 = ["1P 3m 5P 6m 7M 9M", ["mMaj9b6"]], mb6M7 = ["1P 3m 6m 7M"], mb6b9 = ["1P 3m 6m 9m"], o$1 = ["1P 3m 5d", ["mb5", "dim"]], o7 = ["1P 3m 5d 13M", ["diminished", "m6b5", "dim7"]], o7M7 = ["1P 3m 5d 6M 7M"], oM7 = ["1P 3m 5d 7M"], sus24 = ["1P 2M 4P 5P", ["sus4add9"]], madd4 = ["1P 3m 4P 5P"], madd9 = ["1P 3m 5P 9M"], cdata = {
  4: ["1P 4P 7m 10m", ["quartal"]],
  5: ["1P 5P"],
  7: ["1P 3M 5P 7m", ["Dominant", "Dom"]],
  9: ["1P 3M 5P 7m 9M", ["79"]],
  11: ["1P 5P 7m 9M 11P"],
  13: ["1P 3M 5P 7m 9M 13M", ["13_"]],
  64: ["5P 8P 10M"],
  M,
  "M#5": ["1P 3M 5A", ["augmented", "maj#5", "Maj#5", "+", "aug"]],
  "M#5add9": ["1P 3M 5A 9M", ["+add9"]],
  M13,
  "M13#11": ["1P 3M 5P 7M 9M 11A 13M", ["maj13#11", "Maj13#11", "M13+4", "M13#4"]],
  M6,
  "M6#11": ["1P 3M 5P 6M 11A", ["M6b5", "6#11", "6b5"]],
  M69,
  "M69#11": ["1P 3M 5P 6M 9M 11A"],
  "M7#11": ["1P 3M 5P 7M 11A", ["maj7#11", "Maj7#11", "M7+4", "M7#4"]],
  "M7#5": ["1P 3M 5A 7M", ["maj7#5", "Maj7#5", "maj9#5", "M7+"]],
  "M7#5sus4": ["1P 4P 5A 7M"],
  "M7#9#11": ["1P 3M 5P 7M 9A 11A"],
  M7add13,
  M7b5,
  M7b6,
  M7b9,
  M7sus4,
  M9,
  "M9#11": ["1P 3M 5P 7M 9M 11A", ["maj9#11", "Maj9#11", "M9+4", "M9#4"]],
  "M9#5": ["1P 3M 5A 7M 9M", ["Maj9#5"]],
  "M9#5sus4": ["1P 4P 5A 7M 9M"],
  M9b5,
  M9sus4,
  Madd9,
  Maj7,
  Mb5,
  Mb6,
  Msus2,
  Msus4,
  Maddb9,
  "11b9": ["1P 5P 7m 9m 11P"],
  "13#11": ["1P 3M 5P 7m 9M 11A 13M", ["13+4", "13#4"]],
  "13#9": ["1P 3M 5P 7m 9A 13M", ["13#9_"]],
  "13#9#11": ["1P 3M 5P 7m 9A 11A 13M"],
  "13b5": ["1P 3M 5d 6M 7m 9M"],
  "13b9": ["1P 3M 5P 7m 9m 13M"],
  "13b9#11": ["1P 3M 5P 7m 9m 11A 13M"],
  "13no5": ["1P 3M 7m 9M 13M"],
  "13sus4": ["1P 4P 5P 7m 9M 13M", ["13sus"]],
  "69#11": ["1P 3M 5P 6M 9M 11A"],
  "7#11": ["1P 3M 5P 7m 11A", ["7+4", "7#4", "7#11_", "7#4_"]],
  "7#11b13": ["1P 3M 5P 7m 11A 13m", ["7b5b13"]],
  "7#5": ["1P 3M 5A 7m", ["+7", "7aug", "aug7"]],
  "7#5#9": ["1P 3M 5A 7m 9A", ["7alt", "7#5#9_", "7#9b13_"]],
  "7#5b9": ["1P 3M 5A 7m 9m"],
  "7#5b9#11": ["1P 3M 5A 7m 9m 11A"],
  "7#5sus4": ["1P 4P 5A 7m"],
  "7#9": ["1P 3M 5P 7m 9A", ["7#9_"]],
  "7#9#11": ["1P 3M 5P 7m 9A 11A", ["7b5#9"]],
  "7#9#11b13": ["1P 3M 5P 7m 9A 11A 13m"],
  "7#9b13": ["1P 3M 5P 7m 9A 13m"],
  "7add6": ["1P 3M 5P 7m 13M", ["67", "7add13"]],
  "7b13": ["1P 3M 7m 13m"],
  "7b5": ["1P 3M 5d 7m"],
  "7b6": ["1P 3M 5P 6m 7m"],
  "7b9": ["1P 3M 5P 7m 9m"],
  "7b9#11": ["1P 3M 5P 7m 9m 11A", ["7b5b9"]],
  "7b9#9": ["1P 3M 5P 7m 9m 9A"],
  "7b9b13": ["1P 3M 5P 7m 9m 13m"],
  "7b9b13#11": ["1P 3M 5P 7m 9m 11A 13m", ["7b9#11b13", "7b5b9b13"]],
  "7no5": ["1P 3M 7m"],
  "7sus4": ["1P 4P 5P 7m", ["7sus"]],
  "7sus4b9": ["1P 4P 5P 7m 9m", ["susb9", "7susb9", "7b9sus", "7b9sus4", "phryg"]],
  "7sus4b9b13": ["1P 4P 5P 7m 9m 13m", ["7b9b13sus4"]],
  "9#11": ["1P 3M 5P 7m 9M 11A", ["9+4", "9#4", "9#11_", "9#4_"]],
  "9#11b13": ["1P 3M 5P 7m 9M 11A 13m", ["9b5b13"]],
  "9#5": ["1P 3M 5A 7m 9M", ["9+"]],
  "9#5#11": ["1P 3M 5A 7m 9M 11A"],
  "9b13": ["1P 3M 7m 9M 13m"],
  "9b5": ["1P 3M 5d 7m 9M"],
  "9no5": ["1P 3M 7m 9M"],
  "9sus4": ["1P 4P 5P 7m 9M", ["9sus"]],
  m,
  "m#5": ["1P 3m 5A", ["m+", "mb6"]],
  m11,
  "m11A 5": ["1P 3m 6m 7m 9M 11P"],
  m11b5,
  m13,
  m6,
  m69,
  m7,
  "m7#5": ["1P 3m 6m 7m"],
  m7add11,
  m7b5,
  m9,
  "m9#5": ["1P 3m 6m 7m 9M"],
  m9b5,
  mMaj7,
  mMaj7b6,
  mM9,
  mM9b6,
  mb6M7,
  mb6b9,
  o: o$1,
  o7,
  o7M7,
  oM7,
  sus24,
  "+add#9": ["1P 3M 5A 9A"],
  madd4,
  madd9
};
var chr = function(t) {
  return chroma$2(t) || chroma$1(t) || 0;
};
function chroma(t) {
  if (isChroma(t))
    return t;
  if (!Array.isArray(t))
    return "";
  var e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return t.map(chr).forEach(function(i) {
    e[i] = 1;
  }), e.join("");
}
var REGEX = /^[01]{12}$/;
function isChroma(t) {
  return REGEX.test(t);
}
var dictionary = function(t) {
  var e = Object.keys(t).sort(), i = [], r = [], s = function(l, x, P) {
    i[l] = x, r[P] = r[P] || [], r[P].push(l);
  };
  e.forEach(function(l) {
    var x = t[l][0].split(" "), P = t[l][1], y = chroma(x);
    s(l, x, y), P && P.forEach(function(p) {
      return s(p, x, y);
    });
  });
  var n = Object.keys(i).sort(), d = function(l) {
    return i[l];
  };
  return d.names = function(l) {
    return typeof l == "string" ? (r[l] || []).slice() : (l === !0 ? n : e).slice();
  }, d;
}, scale = dictionary(sdata), chord = dictionary(cdata);
scale.names;
chord.names;
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
    this.ext = this.extrude, this.ext2 = this.extrudeto, this.mov = this.move, this.mov2 = this.moveto, this.tur = this.turn, this.tur2 = this.turnto, this.ret = this.retract, this.unret = this.unretract, this.gcodeListeners = [], this.printListeners = [], this.errorListeners = [], this.opListeners = [], this._layerHeight = 0.2, this.lastSpeed = -1, this._heading = 0, this._elevation = 0, this._distance = 0, this._waitTime = 0, this._autoRetract = !0, this._bpm = 120, this._intervalTime = 16, this._stopped = !1, this.totalMoveTime = 0, this.maxFilamentPerOperation = 30, this.minFilamentPerOperation = 2e-4, this.maxTimePerOperation = 6e4, this.currentRetraction = 0, this.retractLength = 8.5, this._retractSpeed = 30 * 60, this.firmwareRetract = !1, this.extraUnretract = 0, this.unretractZHop = 0, this.boundaryMode = "stop", this.maxMovePerCycle = 200, this.setProperties(t);
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
   * Set flag for stopping all operations
   */
  stop(t = !0) {
    this._stopped = t;
  }
  /**
   *  Notify listeners that GCode is ready to be consumed.
   *  @param {String} gcode GCode command string to send
   *  @returns{any} Nothing.
   */
  async gcodeEvent(t) {
    await Promise.all(
      this.gcodeListeners.map(async (e) => e.gcodeEvent(t))
    );
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
    return await this.printEvent({
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
    )), await this.printEvent({
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
    return this.stop(!1), await this.gcodeEvent("G28"), await this.gcodeEvent("M114"), await this.gcodeEvent("M106 S0"), await this.gcodeEvent("M104 S" + t), await this.sendFirmwareRetractSettings(), this.x = 0, this.y = this.maxy, this.z = this.maxz, this.totalMoveTime = 0, this.printspeed(this._defaultPrintSpeed), this.travelspeed(this._defaultPrintSpeed), await this.sync(), this;
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
    ), n = i ? i - this.z : 0, d = Vector.sub(s, this.position);
    if (this._distance = d.mag(), this._elevation = Math.atan2(
      n,
      Math.hypot(d.axes.x, d.axes.y)
    ), this._distance + this._elevation < 1e-5) {
      this._elevation = 0, this._distance = 0;
      return;
    }
    return this._heading = Math.atan2(d.axes.y, d.axes.x), Logger.debug(`heading ${this._heading}`), Logger.debug(`heading ${this.angle}`), r && this.speed(1e3 * this._distance / this.parseAsTime(r)), this;
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
    let i = 0;
    const r = { speed: this._printSpeed };
    try {
      i = this.parseAsTime(t);
    } catch (n) {
      throw n;
    }
    await this.printEvent({
      type: "drawtime-start",
      speed: this._printSpeed,
      start: e,
      end: i
    }), i += this.totalMoveTime, this._distance = 0;
    let s = 2e4;
    for (; s && this.totalMoveTime < i; ) {
      if (this._stopped)
        throw new Exception("drawtime() manually stopped");
      s--;
      const n = performance.now(), d = this.x, l = this.y, x = this.z, P = this.totalMoveTime - e, y = this._timeWarp({
        dt: this._intervalTime,
        t: P,
        tt: this.totalMoveTime
      }), p = this.t2mm(y);
      let f = 0, h = p;
      const { d: a, heading: c, elevation: v } = this._warp({
        d: p,
        heading: this._heading,
        elevation: this._elevation,
        t: P,
        tt: this.totalMoveTime
      });
      h = a, Math.abs(v) > Number.EPSILON && (h = a * Math.cos(v), f = a * Math.sin(v)), r.x = d + h * Math.cos(c), r.y = l + h * Math.sin(c), r.z = x + f, await this.extrudeto(r), Logger.debug(
        `Move time warp op took ${performance.now() - n} ms vs. expected ${this._intervalTime}.`
      ), await this.printEvent({
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
        return targetTime = this.midi2speed(timeStr), targetTime;
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
    let n = 2e4;
    for (await this.printEvent({
      type: "draw-start",
      speed: this._printSpeed,
      length: this._distance
    }); n && i < r; ) {
      if (this._stopped)
        throw new Exception("draw() manually stopped");
      n--;
      const d = this.totalMoveTime - e, l = performance.now(), x = this.x, P = this.y, y = this.z, p = this._timeWarp({
        dt: this._intervalTime,
        t: d,
        tt: this.totalMoveTime
      }), f = Math.min(this.t2mm(p), r - i), { d: h, heading: a, elevation: c } = this._warp({
        d: f,
        heading: this._heading,
        elevation: this._elevation,
        t: d,
        tt: this.totalMoveTime
      });
      if (f + c < 1e-5) {
        console.error(
          `draw() SHORT: ${n}, ${r} ${r - i} / ${f}`
        );
        break;
      }
      let v = h * Math.sin(c), _ = h * Math.cos(c);
      s.x = x + _ * Math.cos(a), s.y = P + _ * Math.sin(a), s.z = y + v, await this.extrudeto(s), i += f, Logger.debug(
        `Move draw warp op took ${performance.now() - l} ms vs. expected ${this._intervalTime}.`
      );
    }
    return this._elevation = 0, this._distance = 0, await this.printEvent({
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
    const e = "M", i = "E", r = "L", s = "R", n = "U", d = "D", l = "<", x = ">", P = /([a-zA-Z<>][0-9]+\.?[0-9]*)/gim, y = /([a-zA-Z<>])([0-9]+\.?[0-9]*)/, p = t.match(P);
    for (let f of p) {
      let h = f.match(y);
      if (h.length !== 3)
        throw new Error("[API] Error in command string: " + p);
      const a = h[1].toUpperCase(), c = parseFloat(h[2]);
      switch (a) {
        case e:
          this.distance(c).go();
          break;
        case i:
          this.distance(c).go(1, !1);
          break;
        case r:
          this.turn(c);
          break;
        case s:
          this.turn(-c);
          break;
        case n:
          this.up(c).go();
          break;
        case d:
          this.down(c).go();
          break;
        case l:
          this.retract(c);
          break;
        case x:
          this.unretract(c);
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
    let n = 800;
    for (; n && i < r; ) {
      if (this._stopped)
        throw new Exception("travel() manually stopped");
      n--;
      const d = performance.now(), l = this.totalMoveTime - e, x = this.x, P = this.y, y = this.z, p = this._timeWarp({
        dt: this._intervalTime,
        t: l,
        tt: this.totalMoveTime
      }), f = Math.min(this.t2mm(p), r - i);
      let h = 0, a = f, { d: c, heading: v, elevation: _ } = this._warp({
        d: f,
        heading: this._heading,
        elevation: this._elevation,
        t: l,
        tt: this.totalMoveTime
      });
      if (f + _ < 1e-5) break;
      a = c, Math.abs(_) > Number.EPSILON && (a = c * Math.cos(_), h = c * Math.sin(_)), s.x = x + a * Math.cos(v), s.y = P + a * Math.sin(v), s.z = y + h, await this.moveto(s), i += f, Logger.debug(
        `Move time warp op (${p}) took ${performance.now() - d} ms vs. expected ${this._intervalTime}.`
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
    let i = 0;
    const r = { speed: this._travelSpeed };
    try {
      i = this.parseAsTime(t);
    } catch (n) {
      throw n;
    }
    i += this.totalMoveTime, this._distance = 0;
    let s = 2e4;
    for (; s && this.totalMoveTime < i; ) {
      s--;
      const n = performance.now(), d = this.x, l = this.y, x = this.z, P = this.totalMoveTime - e, y = this._timeWarp({
        dt: this._intervalTime,
        t: P,
        tt: this.totalMoveTime
      }), p = this.t2mm(y);
      let f = 0, h = p, { d: a, heading: c, elevation: v } = this._warp({
        d: p,
        heading: this._heading,
        elevation: this._elevation,
        t: P,
        tt: this.totalMoveTime
      });
      h = a, Math.abs(v) > Number.EPSILON && (h = a * Math.cos(v), f = a * Math.sin(v)), r.x = d + h * Math.cos(c), r.y = l + h * Math.sin(c), r.z = x + f, await this.moveto(r), Logger.debug(
        `Move time warp op took ${performance.now() - n} ms vs. expected ${this._intervalTime}.`
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
    const i = t * t * 2, r = Math.PI * 2 / e, s = Math.sqrt(i - i * Math.cos(r)), n = this._autoRetract;
    this._autoRetract = !1;
    for (let d = 0; d < e; d++)
      this.turn(r, !0), await this.draw(s);
    return this._autoRetract = n, this._autoRetract && await this.retract(), this;
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
    for (let n = 0; n < 2; n++)
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
    const e = t.e === void 0, i = t.x !== void 0 ? parseFloat(t.x) : this.x, r = t.y !== void 0 ? parseFloat(t.y) : this.y, s = t.z !== void 0 ? parseFloat(t.z) : this.z, n = t.e !== void 0 ? parseFloat(t.e) : this.e, d = Math.abs(n - this.e) > 1e-4, l = e || d, x = e && d && (t.retract === !0 || t.retract === void 0 && this._autoRetract);
    !e && d && (this.currentRetraction = 0), x && await this.unretract();
    let P = new Vector({ x: i, y: r, z: s, e: n }), y = parseFloat(
      t.speed !== void 0 ? t.speed : l ? this._printSpeed : this._travelSpeed
    );
    this.layerHeight = parseFloat(
      t.thickness !== void 0 ? t.thickness : this.layerHeight
    ), t.thick !== void 0 && (this.layerHeight = parseFloat(t.thick));
    const p = Vector.sub(P, this.position), f = new Vector(
      p.axes.x,
      p.axes.y,
      p.axes.z
    );
    let h, a;
    if (h = f.mag(), !d && h < Number.EPSILON) return;
    if (h < 1e-4 ? a = 1e3 * p.axes.e / y : a = 1e3 * h / y, Number.isNaN(a))
      throw new Error("Movetime NAN in extrudeTo");
    if (e) {
      const _ = this._filamentDiameter / 2;
      let A = h * this.layerHeight * this.layerHeight;
      if (A > this.maxFilamentPerOperation)
        throw Error("[API] Too much filament in move:" + A);
      this._extrusionInmm3 || (A /= _ * _ * Math.PI), p.axes.e = A, P.axes.e = this.e + p.axes.e;
    }
    if (P = this.clipToPrinterBounds(P.axes), this.totalMoveTime += a, a > this.maxTimePerOperation)
      throw new Error("[API] move time too long:" + a);
    if (a < 1e-3)
      throw this.errorEvent("[API] total move time too short:" + a), new Error("[API] move time too short:" + a);
    const c = Vector.div(p, a / 1e3);
    if (l) {
      if (Math.abs(c.axes.x) > this._maxPrintSpeed.x)
        throw Error("[API] X printing speed too fast:" + c.axes.x);
      if (Math.abs(c.axes.y) > this._maxPrintSpeed.y)
        throw Error("[API] Y printing speed too fast:" + c.axes.y);
      if (Math.abs(c.axes.z) > this._maxPrintSpeed.z)
        throw Error("[API] Z printing speed too fast:" + c.axes.z);
      if (Math.abs(c.axes.e) > this._maxPrintSpeed.e)
        throw Error(
          "[API] E printing speed too fast:" + c.axes.e + "/" + this._maxPrintSpeed.e
        );
    } else {
      if (Math.abs(c.axes.x) > this._maxTravelSpeed.x)
        throw Error("[API] X travel too fast:" + c.axes.x);
      if (Math.abs(c.axes.y) > this._maxTravelSpeed.y)
        throw Error("[API] Y travel too fast:" + c.axes.y);
      if (Math.abs(c.axes.z) > this._maxTravelSpeed.z)
        throw Error("[API] Z travel too fast:" + c.axes.z);
    }
    const v = { ...this.position.axes };
    this.position.set(P), await this.sendExtrusionGCode(y), l ? await this.printEvent({
      type: "extrude",
      newPosition: { ...this.position.axes },
      oldPosition: { ...v },
      speed: this._printSpeed,
      moveTime: a,
      totalMoveTime: this.totalMoveTime,
      layerHeight: this.layerHeight,
      length: h
    }) : await this.printEvent({
      type: "travel",
      newPosition: { ...this.position.axes },
      oldPosition: { ...v },
      speed: this._travelSpeed,
      moveTime: a,
      totalMoveTime: this.totalMoveTime,
      layerHeight: this.layerHeight,
      length: h
    }), x && await this.retract();
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
      for (let n = 0; n < s; n++) {
        let d = n % 2 === 0 ? -1 : 1;
        await this.draw(e), this.turn(d * 90), await this.draw(i), this.turn(d * 90);
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
    let s = 0, n = 0, d = 0, l = 0;
    for (const x of r)
      if (t < 10) {
        this._waitTime = e;
        break;
      } else {
        let P = this.midi2speed(t, x);
        s += P * P, x === "x" ? this._heading < Math.PI / 2 && this._heading > -Math.PI / 2 ? d = -90 : d = 90 : x === "y" ? this._heading > 0 && this._heading < Math.PI ? n = 90 : n = -90 : x === "z" && (this._elevation > 0 ? l = Math.PI / 2 : l = -Math.PI / 2);
      }
    return this._heading = Math.atan2(n, d), this._elevation = l, this._distance = this.printpeed(Math.sqrt(s)) * e / 1e3, this;
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
    for (var s = 0, n = 0; n < e; s++, n += r) {
      let d = s % 2 === 0 ? 1 : -1;
      await this.move({ y: r }), await this.extrude({ x: d * t });
    }
    return this;
  }
  /**
   * @param {String or Number} note as midi note in string ("C6") or numeric (68) format
   * @param {string} axis of movement: x,y,z
   * @returns {float} speed in mm/s
   */
  midi2speed(t, e = "x") {
    let i = isNaN(t) ? midi(t) : t;
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
    h: n = 0,
    useaspect: d = !0,
    passes: l = 1,
    safeZ: x = 0
  }) {
    x = x || this.layerHeight * l + 10;
    let P = 1 / 0, y = 1 / 0, p = -1 / 0, f = -1 / 0, h = t.length;
    for (; h--; ) {
      let g = t[h].length, u = {
        x: 1 / 0,
        y: 1 / 0,
        x2: -1 / 0,
        y2: -1 / 0,
        area: 0
      };
      for (; g--; )
        P = Math.min(t[h][g][0], P), y = Math.min(t[h][g][1], y), p = Math.max(t[h][g][0], p), f = Math.max(t[h][g][1], f), t[h][g][0] < u.x && (u.x = t[h][g][0]), t[h][g][1] < u.y && (u.y = t[h][g][0]), t[h][g][0] > u.x2 && (u.x2 = t[h][g][0]), t[h][g][1] > u.y2 && (u.y2 = t[h][g][0]);
      u.area = (1 + u.x2 - u.x) * (1 + u.y2 - u.y), t[h].bounds = u;
    }
    const a = p - P, c = f - y, v = s && n, _ = s || n;
    if (!v)
      if (_)
        if (s > 0) {
          const g = c / a;
          n = s * g;
        } else {
          const g = a / c;
          s = n * g;
        }
      else
        s = a, n = c;
    const A = makeMapping([P, p], [i, i + s]), E = makeMapping([y, f], [e, e + n]);
    t.sort(function(g, u) {
      return g.bounds.x < u.bounds.x ? -1 : 1;
    });
    for (let g = 0, u = t.length; g < u; g++) {
      let b = t[g].slice();
      for (let S = 1; S <= l; S++) {
        const w = S * this.layerHeight + r;
        await this.moveto({
          x: A(b[0][0]),
          y: E(b[0][1])
        }), await this.moveto({ z: w }), await this.unretract();
        for (let F = 0, z = b.length; F < z; F++) {
          const T = b[F];
          await this.extrudeto({
            x: A(T[0]),
            y: E(T[1]),
            retract: !1
          });
        }
        S < l ? b.reverse() : (await this.retract(), await this.moveto({ z: x }));
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
    h: n = 0,
    t: d = 1,
    useaspect: l = !0,
    passes: x = 1,
    safeZ: P = 0
  }) {
    P = P || this.layerHeight * x + 10, d = this.layerHeight * 2.5 * d;
    let y = 1 / 0, p = 1 / 0, f = -1 / 0, h = -1 / 0, a = t.length;
    for (; a--; ) {
      let u = t[a].length, b = {
        x: 1 / 0,
        y: 1 / 0,
        x2: -1 / 0,
        y2: -1 / 0,
        area: 0
      };
      for (; u--; )
        y = Math.min(t[a][u][0], y), p = Math.min(t[a][u][1], p), f = Math.max(t[a][u][0], f), h = Math.max(t[a][u][1], h), t[a][u][0] < b.x && (b.x = t[a][u][0]), t[a][u][1] < b.y && (b.y = t[a][u][0]), t[a][u][0] > b.x2 && (b.x2 = t[a][u][0]), t[a][u][1] > b.y2 && (b.y2 = t[a][u][0]);
      t[a].bounds = b;
    }
    const c = f - y, v = h - p, _ = s && n, A = s || n;
    if (!_)
      if (A)
        if (s > 0) {
          const u = v / c;
          n = s * u;
        } else {
          const u = c / v;
          s = n * u;
        }
      else
        s = c, n = v;
    const E = makeMapping([y, f], [i, i + s]), g = makeMapping([p, h], [e, e + n]);
    t.sort(function(u, b) {
      return u.bounds.x < b.bounds.x ? -1 : 1;
    });
    for (let u = 1; u <= x; u++)
      for (let b = 0, S = t.length; b < S; b++) {
        let w = t[b].slice();
        const F = u * this.layerHeight + r;
        if (await this.moveto({
          x: E(w[0][0]),
          y: g(w[0][1])
        }), await this.moveto({ z: F }), w.length > 1) {
          let z = 0, T = 0, j = E(w[0][0]), k = g(w[0][1]), $ = Math.atan2(
            g(w[1][1]) - k,
            E(w[1][0]) - j
          );
          for (let I = 1, H = w.length; I < H; I++) {
            const D = w[I], O = E(D[0]), V = g(D[1]), C = O - j, N = V - k, L = Math.atan2(N, C);
            L !== $ ? (await this.drawfill(z || 2, T || 2, d), z = T = 0, this.turn(L), $ = L) : (z += C, T += N);
          }
        }
        u < x ? w.reverse() : await this.moveto({ z: P });
      }
    return this;
  }
}
export {
  LivePrinter
};
