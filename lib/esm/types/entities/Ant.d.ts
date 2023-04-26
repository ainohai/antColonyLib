import { AntWorld, Cell } from "./World";
import { AntAction, AntPheremone, AntState, Coordinate, Direction } from "../types";
export declare class Ant {
    id: Readonly<string>;
    location: Coordinate;
    ageLeft: number;
    currentAngle: number;
    state: AntState;
    pheremone: AntPheremone | undefined;
    constructor(x: number, y: number, id: string);
    get isDead(): boolean;
    respawnAtCell(homeCoord: Coordinate): void;
    shouldRespawn(): boolean;
    randomizeDirection(): void;
    turnAround(): void;
    move: (directions: Direction, world: AntWorld) => void;
    exploreWorld(world: AntWorld, tick: number): Cell;
    simulateAnt(world: AntWorld, currentTick: number): AntAction;
    private moveActions;
    private foundHome;
    private foundFood;
}
//# sourceMappingURL=Ant.d.ts.map