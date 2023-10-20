import { SimulationWorld } from "./World";
import { walkerAction, WalkerState, Coordinate, Direction, DirectionScore, WalkerPheremone } from "../types";
import { Agent } from "./Agent";
export interface WalkerInterface {
    ageLeft: number;
    currentAngle: number;
    state: WalkerState;
    pheremone: WalkerPheremone | undefined;
    initialState: WalkerState;
    initialPheremone: WalkerPheremone | undefined;
    simulate(world: SimulationWorld, currentTick: number): walkerAction;
    move(directions: Direction, world: SimulationWorld): void;
}
export declare abstract class Walker extends Agent implements WalkerInterface {
    ageLeft: number;
    currentAngle: number;
    state: WalkerState;
    pheremone: WalkerPheremone | undefined;
    initialState: WalkerState;
    initialPheremone: WalkerPheremone | undefined;
    constructor(x: number, y: number, walkerState: WalkerState, initialPheremone: WalkerPheremone | undefined);
    get isDead(): boolean;
    respawnAtCell(homeCoord: Coordinate): void;
    shouldRespawn(): boolean;
    randomizeDirection(): void;
    turnAround(): void;
    move: (directions: Direction, world: SimulationWorld) => void;
    exploreWorld(world: SimulationWorld, tick: number): [number, number];
    protected abstract pickNextDirection(world: SimulationWorld, tick: number): DirectionScore | undefined;
    simulate(world: SimulationWorld, currentTick: number): walkerAction;
    protected abstract moveActions(newLocation: [number, number], action: walkerAction, currentTick: number, world: SimulationWorld): walkerAction;
}
//# sourceMappingURL=Walker.d.ts.map