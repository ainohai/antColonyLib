import { SimulationWorld } from "./entities/World";
export declare type PheremoneRules = {
    walkerDecay: number;
    cellDecay: number;
    weight: number;
    maxPheremone: number;
    goodScoreThreshold: number;
};
export declare type ConfigType = {
    walkerLifespan: number;
    sight: number;
    walkerAnarchyRandomPercentage: number;
    moveForwardPercentage: number;
    pheremoneRules: {
        [key in PheremoneType]: PheremoneRules;
    };
};
export declare type ParametersType = {
    COLUMNS: number;
    ROWS: number;
    RESPAWN_PERCENTAGE: number;
    NUM_OF_WALKERS: number;
};
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
export declare enum walkerAction {
    FOUND_FOOD = 0,
    NESTED_FOOD = 1,
    NO_ACTION = 2
}
export declare type SimulationState = {
    world: SimulationWorld;
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
    pheremoneWalkerDecay: () => number;
    goodScoreThreshold: () => number;
};
export declare type WalkerState = {
    startedInStateOnTick: number;
    lockedInStateUntilTick: number | undefined;
    lastChoice: ChoiceType;
};
export interface AntState extends WalkerState {
    mode: AntDecisionModeType;
    hasFood: boolean;
}
export declare type WalkerPheremone = {
    type: PheremoneType;
    pickedUpPheremoneOnTick: number;
};
export declare enum AgentType {
    HOME = 0,
    FOOD = 1,
    WALKER = 2
}
//# sourceMappingURL=types.d.ts.map