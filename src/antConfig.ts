
export type configType = {
    antLifespan: number;
    sight: number;
    foodPheremoneDecay: number;
    homePheremoneDecay: number;
    moveRandomPercentage: number;
    moveForwardPercentage: number;
    foodDistanceFactor: number;
    homeDistanceFactor: number;
};
type ParametersType = {
    COLUMNS: number;
    ROWS: number;
    RESPAWN_PERCENTAGE: number;
    NUM_OF_ANTS: number;
};

export const staticParameters: Readonly<ParametersType> = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_ANTS: 700,
};


//todo: only set via setter. get via getter?
export let antConfig: configType = {
    antLifespan: 10000,
    sight: 10,
    foodPheremoneDecay: 0.2,
    homePheremoneDecay: 0.2,
    moveRandomPercentage: 0.1,
    moveForwardPercentage: 0.1,
    foodDistanceFactor: 1,
    homeDistanceFactor: 1,
};

export enum CellStates {
    EMPTY,
    FOOD,
    HOME
}

//Should use partial objects here
export const setAntConfig = (config: configType) => {
    antConfig = config;
}