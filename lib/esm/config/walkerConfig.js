import { PheremoneType } from "../types";
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
        [PheremoneType.SUGAR]: {
            walkerDecay: 0.007,
            cellDecay: 0.005,
            weight: 10,
            maxPheremone: 100,
            goodScoreThreshold: 0.0004
        },
        [PheremoneType.HOME]: {
            walkerDecay: 0.0001,
            cellDecay: 0.0001,
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
export const staticParameters = () => {
    if (!params) {
        throw Error("No static parameters set.");
    }
    return params;
};
/** Use once before starting the simulation. */
export const setStaticParameters = (parameters) => {
    if (!!params) {
        console.log("Static parameters are already set");
    }
    params = { ...defaultParameters, ...parameters };
    return params;
};
export const walkerConfig = () => {
    if (!confs) {
        throw "Trying to use confs before setting them";
    }
    return confs;
};
/** Can be used during the simulation */
export const setVariableParameters = (configs) => {
    confs = configs;
    return confs;
};
