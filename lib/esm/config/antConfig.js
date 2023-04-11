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
export const antConfig = () => {
    return confs;
};
/** Can be used during the simulation */
export const setVariableParameters = (configs) => {
    confs = { ...confs, ...configs };
    return confs;
};
