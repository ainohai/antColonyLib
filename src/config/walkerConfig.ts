import { ConfigType as VariableConfigType, ParametersType, PheremoneType } from "../types";

const defaultParameters: Readonly<ParametersType> = {
    COLUMNS: 50,
    ROWS: 50,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_WALKERS: 700,
};

//Remember params can change during simulation. 
const defaultVariableParams: Readonly<VariableConfigType> = {
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
                walkerDecay: 0.05,
                cellDecay: 0.001, 
                weight: 10,
                maxPheremone: 100,
                goodScoreThreshold: 0.0002
            }
        },    
    walkerAnarchyRandomPercentage: 0.01, //chance not to move where you should
    moveForwardPercentage: 0.75, // When seeking food. walkers are this likely to just move forward, otherwise they will select random 
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

export const walkerConfig = (): VariableConfigType => {
    if (!confs) {
        throw "Trying to use confs before setting them"
    }
    return confs;
};

/** Can be used during the simulation */
export const setVariableParameters = (configs: VariableConfigType): Readonly<VariableConfigType> => {
    confs = configs;
    return confs;
}
