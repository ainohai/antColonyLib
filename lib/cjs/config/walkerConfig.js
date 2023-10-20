"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVariableParameters = exports.walkerConfig = exports.setStaticParameters = exports.staticParameters = void 0;
const types_1 = require("../types");
const defaultParameters = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_WALKERS: 700,
};
//Remember params can change during simulation. 
const defaultVariableParams = {
    walkerLifespan: 10000,
    sight: 10,
    pheremoneRules: {
        [types_1.PheremoneType.SUGAR]: {
            walkerDecay: 0.007,
            cellDecay: 0.005,
            weight: 10,
            maxPheremone: 100,
            goodScoreThreshold: 0.0004
        },
        [types_1.PheremoneType.HOME]: {
            walkerDecay: 0.01,
            cellDecay: 0.001,
            weight: 10,
            maxPheremone: 100,
            goodScoreThreshold: 0.0002
        }
    },
    walkerAnarchyRandomPercentage: 0.01,
    moveForwardPercentage: 0.75, // When seeking food. walkers are this likely to just move forward, otherwise they will select random 
};
let params;
let confs;
;
const staticParameters = () => {
    if (!params) {
        throw Error("No static parameters set.");
    }
    return params;
};
exports.staticParameters = staticParameters;
/** Use once before starting the simulation. */
const setStaticParameters = (parameters) => {
    if (!!params) {
        console.log("Static parameters are already set");
    }
    params = Object.assign(Object.assign({}, defaultParameters), parameters);
    return params;
};
exports.setStaticParameters = setStaticParameters;
const walkerConfig = () => {
    if (!confs) {
        throw "Trying to use confs before setting them";
    }
    return confs;
};
exports.walkerConfig = walkerConfig;
/** Can be used during the simulation */
const setVariableParameters = (configs) => {
    confs = configs;
    return confs;
};
exports.setVariableParameters = setVariableParameters;
