import { AntDecisionModeType, DirectionScore } from "../types";
import { Ant } from "./Ant";
import { AntWorld } from "./World";
interface AntModeActions {
    chosen: (ant: Ant, world: AntWorld, tick: number) => DirectionScore | undefined;
}
export declare const modeActions: (mode: AntDecisionModeType) => AntModeActions;
export {};
//# sourceMappingURL=AntState.d.ts.map