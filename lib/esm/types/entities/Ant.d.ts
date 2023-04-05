import { AntWorld, Cell } from "./World";
import { AntAction, AntState, Coordinate, Direction } from "../types";
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
    simulateAnt(world: AntWorld, currentTick: number): AntAction;
    private score;
    private foundHome;
    private foundFood;
}
//# sourceMappingURL=Ant.d.ts.map