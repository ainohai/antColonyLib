import { ParametersType, SimulationState } from '../types';
export declare class Simulation {
    tick: number;
    state: SimulationState;
    constructor(params: Partial<ParametersType>);
    run(): SimulationState;
    getState(): SimulationState;
}
//# sourceMappingURL=Simulation.d.ts.map