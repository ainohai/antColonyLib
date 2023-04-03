"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVariableParameters = exports.antConfig = exports.setStaticParameters = exports.staticParameters = void 0;
const defaultParameters = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_ANTS: 700,
};
const defaultVariableParams = {
    antLifespan: 10000,
    sight: 10,
    foodPheremoneDecay: 0.2,
    homePheremoneDecay: 0.2,
    moveRandomPercentage: 0.1,
    moveForwardPercentage: 0.1,
    foodDistanceFactor: 1,
    homeDistanceFactor: 1,
};
let params;
let confs = defaultVariableParams;
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
        throw Error("Static parameters are already set");
    }
    params = Object.assign(Object.assign({}, defaultParameters), parameters);
    return params;
};
exports.setStaticParameters = setStaticParameters;
const antConfig = () => {
    return confs;
};
exports.antConfig = antConfig;
/** Can be used during the simulation */
const setVariableParameters = (configs) => {
    confs = Object.assign(Object.assign({}, confs), configs);
    return confs;
};
exports.setVariableParameters = setVariableParameters;
