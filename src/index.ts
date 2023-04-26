import { antConfig, setVariableParameters, staticParameters } from "./config/antConfig";
import { Ant } from "./entities/Ant";
import { AntWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";
import { AntDecisionModeType, AntState, ChoiceType, ConfigType, ParametersType } from "./types";


export type { Ant };
export type { AntWorld };
export type { Simulation };
export { AntState };
export type { ParametersType };
export type { ConfigType };
export { ChoiceType };
export {AntDecisionModeType};

export function getStaticParams(): Readonly<ParametersType> {
    return {...staticParameters()};
}


/** User should not be able to modify config from here. 
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
export function getConfig(): Readonly<ConfigType> {
    console.log("Get config");
    return {...antConfig()};
}

export function setVariableParams(antConfig: ConfigType) {
    setVariableParameters(antConfig);
}

export function createSimulation(params: Partial<ParametersType>): Simulation{
    return new Simulation(params);
}
  
export default {
    getConfig,
    getStaticParams,
    createSimulation,
};

