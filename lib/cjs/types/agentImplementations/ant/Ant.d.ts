import { walkerAction, DirectionScore } from "../../types";
import { Walker } from "../../entities/Walker";
import { SimulationWorld as SimulationWorld } from "../../entities/World";
export declare class Ant extends Walker {
    id: Readonly<string>;
    constructor(x: number, y: number, id: string);
    deleteMe(): boolean;
    protected moveActions(newLocation: [number, number], action: walkerAction, currentTick: number, world: SimulationWorld): walkerAction;
    private foundHome;
    protected pickNextDirection(world: SimulationWorld, tick: number): DirectionScore | undefined;
    private foundFood;
}
//# sourceMappingURL=Ant.d.ts.map