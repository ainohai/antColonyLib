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
    antFoodPheremoneWeight: 10,
    antHomePheremoneWeight: 10,
    goodFoodScoreTreshold: 0.0004,
    goodHomeScoreTreshold: 0.0002,
    maxPheremone: 100
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
export const antConfig = () => {
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
