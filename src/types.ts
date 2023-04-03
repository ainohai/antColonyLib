export type configType = {
    antLifespan: number;
    sight: number;
    foodPheremoneDecay: number;
    homePheremoneDecay: number;
    moveRandomPercentage: number;
    moveForwardPercentage: number;
    foodDistanceFactor: number;
    homeDistanceFactor: number;
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

export type Coordinate = [
    x: number, 
    y: number
]

export type DirectionScore = {direction: Direction, score: number}

export enum AntState {
    SEARCH_FOOD,
    CARRY_FOOD
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
