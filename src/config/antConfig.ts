import { ConfigType as VariableConfigType, ParametersType } from "../types";

const defaultParameters: Readonly<ParametersType> = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_ANTS: 700,
};

const defaultVariableParams: Readonly<VariableConfigType> = {
    antLifespan: 10000,
    sight: 10,
    foodPheremoneDecay: 0.005,
    homePheremoneDecay: 0.001,
    antAnarchyRandomPercentage: 0.01, //chance not to move where you should
    moveForwardPercentage: 0.75, // When seeking food. Ants are this likely to just move forward, otherwise they will select random 
    antFoodPheremoneDecay: 0.007,
    antHomePheremoneDecay: 0.01,
    antPheremoneWeight: 10,
    goodScoreTreshold: 0.0004
};

let params: ParametersType;
let confs: VariableConfigType | undefined;;

export const staticParameters = (): Readonly<ParametersType> => {
    if (!params) {
        throw Error("No static parameters set.")
    }
    return params;
};

/** Use once before starting the simulation. */
export const setStaticParameters = (parameters: Partial<ParametersType>): Readonly<ParametersType> => {
    if (!!params) {
        console.log("Static parameters are already set");
    }
    params = {...defaultParameters, ...parameters}
    return params;
}

export const antConfig = (): VariableConfigType => {
    if (!confs) {
        throw "Trying to use confs before setting them"
    }
    return confs;
};

/** Can be used during the simulation */
export const setVariableParameters = (configs: Partial<VariableConfigType>): Readonly<VariableConfigType> => {
    confs = !!confs ? {...confs, ...configs} : {...defaultVariableParams, ...configs}
    return confs;
}
