import { Ant } from "./entities/Ant";
import { AntWorld } from "./entities/World";

export type ConfigType = {
    antLifespan: number;
    sight: number;
    foodPheremoneDecay: number;
    homePheremoneDecay: number;
    antAnarchyRandomPercentage: number;
    moveForwardPercentage: number;
    antFoodPheremoneDecay: number
    antHomePheremoneDecay: number;
    antPheremoneWeight: number;
    goodScoreTreshold: number;
};
export type ParametersType = {
    COLUMNS: number;
    ROWS: number;
    RESPAWN_PERCENTAGE: number;
    NUM_OF_ANTS: number;
};

export enum CellStates {
    EMPTY,
    FOOD,
    HOME
};

export enum ChoiceType {
    ANARCHY, 
    SNIFF, 
    RANDOM,
    UNKNOWN
}

export type Coordinate = [
    x: number, 
    y: number
]

export type DirectionScore = {direction: number, score: number, choiceType?: ChoiceType }

export enum AntAction {
    FOUND_FOOD,
    NESTED_FOOD,
    NO_ACTION
}

export type SimulationState = {
    ants: Ant[],
    world: AntWorld,
    statistics: SimulationStatistics
};

export type SimulationStatistics = {
    totalFoods: number,
    foodsPicked: number,
    foodsInNest: number
}

export type Direction = {
    x: -1 | 0 | 1, 
    y: -1 | 0 | 1
}

export const directions: (Readonly<Direction>)[] = [
    { x: 0, y: -1 }, //N
    { x: 1, y: -1 }, //NE
    { x: 1, y: 0 }, //E
    { x: 1, y: 1 }, //SE
    { x: 0, y: 1 }, //S
    { x: -1, y: 1 }, //SW
    { x: -1, y: 0 }, //W,
    { x: -1, y: -1 } //NW
];

export enum AntDecisionModeType {
    SEARHCING_HOME = 0,
    SEARCHING_FOOD = 1,
    ANARCHY = 2
}

export enum PheremoneType {
    SUGAR,
    HOME
}

export type Pheremone = {
    type: PheremoneType,
    pheremoneCellDecay: () => number,
    pheremoneAntDecay: () => number,
    goodScoreThreshold: () => number
}

export type AntState = {
    mode: AntDecisionModeType,
    startedInStateOnTick: number,
    lockedInStateUntilTick: number | undefined,
    hasFood: boolean,
    lastChoice: ChoiceType,
}
export type AntPheremone = {
    type: PheremoneType,
    pickedUpPheremoneOnTick: number
}
