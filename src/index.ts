import { antConfig, staticParameters } from "./config/antConfig";
import { Ant } from "./entities/Ant";
import { AntWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";
import { AntState, configType, ParametersType } from "./types";


export type { Ant };
export type { AntWorld };
export type { Simulation };
export { AntState };
export type {ParametersType};

export function getStaticParams(): Readonly<ParametersType> {
    return {...staticParameters()};
}

export function setVariableParameters(config: configType) {
    setVariableParameters(config);
}

/** User should not be able to modify  */
export function getConfig(): Readonly<configType> {
    return {...antConfig()};
}
  
export function createSimulation(params: Partial<ParametersType>): Simulation{
    return new Simulation(params);
}
  
export default {
    setVariableParameters,
    getConfig,
    getStaticParams,
    createSimulation,
};

