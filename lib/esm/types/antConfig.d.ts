export declare type configType = {
    antLifespan: number;
    sight: number;
    foodPheremoneDecay: number;
    homePheremoneDecay: number;
    moveRandomPercentage: number;
    moveForwardPercentage: number;
    foodDistanceFactor: number;
    homeDistanceFactor: number;
};
declare type ParametersType = {
    COLUMNS: number;
    ROWS: number;
    RESPAWN_PERCENTAGE: number;
    NUM_OF_ANTS: number;
};
export declare const staticParameters: Readonly<ParametersType>;
export declare let antConfig: configType;
export declare enum CellStates {
    EMPTY = 0,
    FOOD = 1,
    HOME = 2
}
export declare const setAntConfig: (config: configType) => void;
export {};
//# sourceMappingURL=antConfig.d.ts.map