import { Ant } from "./entities/Ant";
import { AntWorld } from "./entities/World";
export declare type ConfigType = {
    antLifespan: number;
    sight: number;
    foodPheremoneDecay: number;
    homePheremoneDecay: number;
    antAnarchyRandomPercentage: number;
    moveForwardPercentage: number;
    antFoodPheremoneDecay: number;
    antHomePheremoneDecay: number;
    antFoodPheremoneWeight: number;
    antHomePheremoneWeight: number;
    goodFoodScoreTreshold: number;
    goodHomeScoreTreshold: number;
    maxPheremone: number;
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
export declare enum ChoiceType {
    RANDOM = 0,
    SNIFF = 1,
    ANARCHY = 2,
    UNKNOWN = 3
}
export declare type Coordinate = [
    x: number,
    y: number
];
export declare type DirectionScore = {
    direction: number;
    score: number;
    choiceType?: ChoiceType;
};
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
export declare enum AntDecisionModeType {
    SEARHCING_HOME = 0,
    SEARCHING_FOOD = 1,
    ANARCHY = 2
}
export declare enum PheremoneType {
    SUGAR = 0,
    HOME = 1
}
export declare type Pheremone = {
    type: PheremoneType;
    pheremoneCellDecay: () => number;
    pheremoneAntDecay: () => number;
    goodScoreThreshold: () => number;
};
export declare type AntState = {
    mode: AntDecisionModeType;
    startedInStateOnTick: number;
    lockedInStateUntilTick: number | undefined;
    hasFood: boolean;
    lastChoice: ChoiceType;
};
export declare type AntPheremone = {
    type: PheremoneType;
    pickedUpPheremoneOnTick: number;
};
//# sourceMappingURL=types.d.ts.map