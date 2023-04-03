import { configType as VariableConfigType, ParametersType } from "../types";

const defaultParameters: Readonly<ParametersType> = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_ANTS: 700,
};

const defaultVariableParams: Readonly<VariableConfigType> = {
    antLifespan: 10000,
    sight: 10,
    foodPheremoneDecay: 0.2,
    homePheremoneDecay: 0.2,
    moveRandomPercentage: 0.1,
    moveForwardPercentage: 0.1,
    foodDistanceFactor: 1,
    homeDistanceFactor: 1,
};

let params: ParametersType;
let confs: VariableConfigType = defaultVariableParams;

export const staticParameters = (): Readonly<ParametersType> => {
    if (!params) {
        throw Error("No static parameters set.")
    }
    return params;
};

/** Use once before starting the simulation. */
export const setStaticParameters = (parameters: Partial<ParametersType>): Readonly<ParametersType> => {
    if (!!params) {
        throw Error("Static parameters are already set");
    }
    params = {...defaultParameters, ...parameters}
    return params;
}

export const antConfig = (): Readonly<VariableConfigType> => {
    return confs;
};

/** Can be used during the simulation */
export const setVariableParameters = (configs: Partial<VariableConfigType>): Readonly<VariableConfigType> => {
    confs = {...confs, ...configs}
    return confs;
}
