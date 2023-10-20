import { AntDecisionModeType, DirectionScore } from "../../types";
import { Walker } from "../../entities/Walker";
import { SimulationWorld } from "../../entities/World";
interface WalkerModeActions {
    chosen: (ant: Walker, world: SimulationWorld, tick: number) => DirectionScore | undefined;
}
export declare const modeActions: (mode: AntDecisionModeType) => WalkerModeActions;
export {};
//# sourceMappingURL=AntState.d.ts.map