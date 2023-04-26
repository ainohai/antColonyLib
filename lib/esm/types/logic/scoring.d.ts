import { Ant } from "../entities/Ant";
import { AntWorld, Cell } from "../entities/World";
import { DirectionScore } from "../types";
export declare const scoreDirections: (ant: Ant, world: AntWorld, tick: number, scoreFunction: (ant: Ant, cell: Cell, tick: number) => number) => DirectionScore[];
export declare const getScoreForDirection: (angle: number, ant: Ant, world: AntWorld, currentTick: number, scoreFunction: (ant: Ant, cell: Cell, tick: number) => number) => DirectionScore;
export declare const getRandomDirectionScored: (ant: Ant, world: AntWorld, currentTick: number, scoreFunction: (ant: Ant, cell: Cell, tick: number) => number) => DirectionScore;
//# sourceMappingURL=scoring.d.ts.map