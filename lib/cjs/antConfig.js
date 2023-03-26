"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAntConfig = exports.CellStates = exports.antConfig = exports.staticParameters = void 0;
exports.staticParameters = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_ANTS: 700,
};
//todo: only set via setter. get via getter?
exports.antConfig = {
    antLifespan: 10000,
    sight: 10,
    foodPheremoneDecay: 0.2,
    homePheremoneDecay: 0.2,
    moveRandomPercentage: 0.1,
    moveForwardPercentage: 0.1,
    foodDistanceFactor: 1,
    homeDistanceFactor: 1,
};
var CellStates;
(function (CellStates) {
    CellStates[CellStates["EMPTY"] = 0] = "EMPTY";
    CellStates[CellStates["FOOD"] = 1] = "FOOD";
    CellStates[CellStates["HOME"] = 2] = "HOME";
})(CellStates = exports.CellStates || (exports.CellStates = {}));
//Should use partial objects here
const setAntConfig = (config) => {
    exports.antConfig = config;
};
exports.setAntConfig = setAntConfig;
