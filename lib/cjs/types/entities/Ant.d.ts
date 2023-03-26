import { Direction } from "../logic/directions";
import { AntWorld, Cell } from "./World";
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
export declare class Ant {
    location: Coordinate;
    age: number;
    currentAngle: number;
    state: AntState;
    stepsFromHome: number;
    stepsFromFood: number | undefined;
    private directionScores;
    constructor(x: number, y: number);
    get isDead(): boolean;
    respawnAtCell(homeCoord: Coordinate): void;
    shouldRespawn(): boolean;
    randomizeDirection(): void;
    turnAround(): void;
    move: (directions: Direction, world: AntWorld) => void;
    exploreWorld(world: AntWorld, tick: number): Cell;
    simulateAnt(world: AntWorld, currentTick: number): void;
    private score;
    private foundHome;
    private foundFood;
}
//# sourceMappingURL=Ant.d.ts.map