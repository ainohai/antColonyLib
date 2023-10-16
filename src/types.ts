import { Walker } from "./entities/Walker";
import { SimulationWorld } from "./entities/World";

export type PheremoneRules = {
    walkerDecay: number, 
    cellDecay: number, 
    weight: number, 
    maxPheremone: number,
    goodScoreThreshold: number
}

export type ConfigType = {
    walkerLifespan: number;
    sight: number;
    walkerAnarchyRandomPercentage: number;
    moveForwardPercentage: number;
    pheremoneRules: {[key in PheremoneType]:  PheremoneRules}
};
export type ParametersType = {
    COLUMNS: number;
    ROWS: number;
    RESPAWN_PERCENTAGE: number;
    NUM_OF_WALKERS: number;
};

export enum ChoiceType {
    RANDOM,
    SNIFF, 
    ANARCHY, 
    UNKNOWN
}

export type Coordinate = [
    x: number, 
    y: number
]

export type DirectionScore = {direction: number, score: number, choiceType?: ChoiceType }

export enum WalkerAction {
    FOUND_FOOD,
    NESTED_FOOD,
    NO_ACTION
}

export type SimulationState = {
    world: SimulationWorld,
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
    pheremoneWalkerDecay: () => number, //Maybe move to agent, if more fine grained control is needed.
    goodScoreThreshold: () => number
}

export type WalkerState = {
    startedInStateOnTick: number,
    lockedInStateUntilTick: number | undefined,
    lastChoice: ChoiceType,
}

export interface AntState extends WalkerState {
    mode: AntDecisionModeType,
    hasFood: boolean,
}

export type WalkerPheremone = {
    type: PheremoneType,
    pickedUpPheremoneOnTick: number
}

export enum AgentType {
    HOME, 
    FOOD, 
    WALKER
}