
/**
 * General 3D printer and CNC machine properties
 */

// dictionary of first GCODE sent to printer at start
export const GCODE_HEADER = {
    "UM2": [
      ";FLAVOR:UltiGCode",
      ";TIME:1",
      ";MATERIAL:1"
    ],
    "UM2plus": [
      ";FLAVOR:UltiGCode",
        ";TIME:1",
        ";MATERIAL:1"
      ],
    "UM3": [
      ";START_OF_HEADER",
      ";HEADER_VERSION:0.1",
      ";FLAVOR:Griffin",
      ";GENERATOR.NAME:GCodeGenJS",
      ";GENERATOR.VERSION:?",
      ";GENERATOR.BUILD_DATE:2016-11-26",
      ";TARGET_MACHINE.NAME:Ultimaker Jedi",
      ";EXTRUDER_TRAIN.0.INITIAL_TEMPERATURE:200",
      ";EXTRUDER_TRAIN.0.MATERIAL.VOLUME_USED:1",
      ";EXTRUDER_TRAIN.0.NOZZLE.DIAMETER:0.4",
      ";BUILD_PLATE.INITIAL_TEMPERATURE:0",
      ";PRINT.TIME:1",
      ";PRINT.SIZE.MIN.X:0",
      ";PRINT.SIZE.MIN.Y:0",
      ";PRINT.SIZE.MIN.Z:0",
      ";PRINT.SIZE.MAX.X:215",
      ";PRINT.SIZE.MAX.Y:215",
      ";PRINT.SIZE.MAX.Z:200",
      ";END_OF_HEADER",
      "G92 E0",
    ],
    "REPRAP": [";RepRap target", "G28", "G92 E0"],
};
  

// TODO: check THESE!
// https://ultimaker.com/en/products/ultimaker-2-plus/specifications

export const MAX_SPEED = {
    "UM2plus": {
        maxPrint: { x: 300, y: 300, z: 80, e: 45 },
        maxTravel: { x: 250, y: 250, z: 150, e: 45 },
    },
    
    "UM2": {
      maxPrint: { x: 300, y: 300, z: 80, e: 45 },
      maxTravel: { x: 250, y: 250, z: 150, e: 45 },
  },
    
    "UM3": {
      maxPrint: { x: 300, y: 300, z: 80, e: 45 },
      maxTravel: { x: 250, y: 250, z: 150, e: 45 },
  },

    "REPRAP": {
        maxTravel: { x: 300, y: 300, z: 80, e: 45 },
        maxPrint: { x: 250, y: 250, z: 150, e: 45 },
    }
};
  
export const BED_SIZE = {
    "UM3":  { x: 223, y: 223, z: 305 },
    "UM2":  { x: 223, y: 223, z: 205 },
    "UM2plus":  { x: 223, y: 223, z: 305 },
    "REPRAP":  { x: 150, y: 150, z: 80 }
};

/**
 * Note: only UM2 motors are tested, some others are too quiet!
 */
export const SPEED_SCALE = {
    "UM3" : { x: 47.069852, y: 47.069852, z: 160.0 },
    "UM2" : { x: 47.069852, y: 47.069852, z: 160.0 },
    "UM2plus" : { x: 47.069852, y: 47.069852, z: 160.0 },
    "REPRAP" : { x: 47.069852, y: 47.069852, z: 160.0 }
}

export const FilamentDiameter = { "UM3": 2.85, "UM2": 2.85, "UM2plus": 2.85, "REPRAP": 1.75 };
export const ExtrusionInmm3 = { "UM3": false, "UM2": false, "UM2plus": true, "REPRAP": false };  