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
    foodPheremoneDecay: 0.005,
    homePheremoneDecay: 0.001,
    antAnarchyRandomPercentage: 0.01,
    moveForwardPercentage: 0.75,
    antFoodPheremoneDecay: 0.007,
    antHomePheremoneDecay: 0.01,
    antPheremoneWeight: 10,
    goodScoreTreshold: 0.0004
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
        console.log("Static parameters are already set");
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
