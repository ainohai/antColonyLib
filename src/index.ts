import { antConfig, staticParameters } from "./config/antConfig";
import { Ant } from "./entities/Ant";
import { AntWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";
import { AntState, ConfigType, LastChoice, ParametersType } from "./types";


export type { Ant };
export type { AntWorld };
export type { Simulation };
export { AntState };
export type { ParametersType };
export type { ConfigType };
export { LastChoice };

export function getStaticParams(): Readonly<ParametersType> {
    return {...staticParameters()};
}

export function getVariableParams(): ConfigType  {
    return antConfig();
}

/** User should not be able to modify config from here. 
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
export function getConfig(): Readonly<ConfigType> {
    return {...antConfig()};
}
  
export function createSimulation(params: Partial<ParametersType>, variableParams: Partial<ConfigType>): Simulation{
    return new Simulation(params, variableParams);
}
  
export default {
    getConfig,
    getStaticParams,
    createSimulation,
};

