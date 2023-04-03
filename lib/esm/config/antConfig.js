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
export const staticParameters = () => {
    if (!params) {
        throw Error("No static parameters set.");
    }
    return params;
};
/** Use once before starting the simulation. */
export const setStaticParameters = (parameters) => {
    if (!!params) {
        throw Error("Static parameters are already set");
    }
    params = { ...defaultParameters, ...parameters };
    return params;
};
export const antConfig = () => {
    return confs;
};
/** Can be used during the simulation */
export const setVariableParameters = (configs) => {
    confs = { ...confs, ...configs };
    return confs;
};
