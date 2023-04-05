import { ConfigType, ParametersType, SimulationState } from '../types';
export declare class Simulation {
    tick: number;
    state: SimulationState;
    constructor(params: Partial<ParametersType>, variableParams: Partial<ConfigType>);
    run(): SimulationState;
    getState(): SimulationState;
}
//# sourceMappingURL=Simulation.d.ts.map