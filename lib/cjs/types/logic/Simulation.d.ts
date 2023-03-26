import { Ant } from '../entities/Ant';
import { AntWorld } from '../entities/World';
export declare class Simulation {
    tick: number;
    state: {
        ants: Ant[];
        world: AntWorld;
    };
    constructor(columns: number, rows: number);
    run(): {
        ants: Ant[];
        world: AntWorld;
    };
    getState(): {
        ants: Ant[];
        world: AntWorld;
    };
}
//# sourceMappingURL=Simulation.d.ts.map