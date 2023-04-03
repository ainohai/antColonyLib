import { Ant } from '../entities/Ant';
import { AntWorld } from '../entities/World';
import { ParametersType } from '../types';
export declare class Simulation {
    tick: number;
    state: {
        ants: Ant[];
        world: AntWorld;
    };
    constructor(params: Partial<ParametersType>);
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