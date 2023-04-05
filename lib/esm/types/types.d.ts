import { Ant } from "./entities/Ant";
import { AntWorld } from "./entities/World";
export declare type ConfigType = {
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
export declare enum AntAction {
    FOUND_FOOD = 0,
    NESTED_FOOD = 1,
    NO_ACTION = 2
}
export declare type SimulationState = {
    ants: Ant[];
    world: AntWorld;
    statistics: SimulationStatistics;
};
export declare type SimulationStatistics = {
    totalFoods: number;
    foodsPicked: number;
    foodsInNest: number;
};
export declare type Direction = {
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
};
export declare const directions: (Readonly<Direction>)[];
//# sourceMappingURL=types.d.ts.map