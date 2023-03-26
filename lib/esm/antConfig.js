export const staticParameters = {
    COLUMNS: 500,
    ROWS: 500,
    RESPAWN_PERCENTAGE: 0.5,
    NUM_OF_ANTS: 700,
};
//todo: only set via setter. get via getter?
export let antConfig = {
    antLifespan: 10000,
    sight: 10,
    foodPheremoneDecay: 0.2,
    homePheremoneDecay: 0.2,
    moveRandomPercentage: 0.1,
    moveForwardPercentage: 0.1,
    foodDistanceFactor: 1,
    homeDistanceFactor: 1,
};
export var CellStates;
(function (CellStates) {
    CellStates[CellStates["EMPTY"] = 0] = "EMPTY";
    CellStates[CellStates["FOOD"] = 1] = "FOOD";
    CellStates[CellStates["HOME"] = 2] = "HOME";
})(CellStates || (CellStates = {}));
//Should use partial objects here
export const setAntConfig = (config) => {
    antConfig = config;
};
