import { Walker } from "../entities/Walker";
import { SimulationWorld } from "../entities/World";
import { Coordinate, DirectionScore } from "../types";
export declare const scoreDirections: (walker: Walker, world: SimulationWorld, tick: number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number) => DirectionScore[];
export declare const getScoreForDirection: (angle: number, walker: Walker, world: SimulationWorld, currentTick: number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number) => DirectionScore;
export declare const getRandomDirectionScored: (walker: Walker, world: SimulationWorld, currentTick: number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number) => DirectionScore;
//# sourceMappingURL=scoring.d.ts.map