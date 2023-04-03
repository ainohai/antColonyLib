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
export declare type ParametersType = {
    COLUMNS: number;
    ROWS: number;
    RESPAWN_PERCENTAGE: number;
    NUM_OF_ANTS: number;
};
export declare enum CellStates {
    EMPTY = 0,
    FOOD = 1,
    HOME = 2
}
export declare type Coordinate = [
    x: number,
    y: number
];
export declare type DirectionScore = {
    direction: Direction;
    score: number;
};
export declare enum AntState {
    SEARCH_FOOD = 0,
    CARRY_FOOD = 1
}
export declare type Direction = {
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
};
export declare const directions: (Readonly<Direction>)[];
//# sourceMappingURL=types.d.ts.map