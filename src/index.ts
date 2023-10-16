import { Ant } from "./agentImplementations/ant/Ant";
import { walkerConfig, setVariableParameters, staticParameters } from "./config/walkerConfig";
import { Walker } from "./entities/Walker";
import { SimulationWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";
import { AntDecisionModeType, WalkerState, ChoiceType, ConfigType, ParametersType, PheremoneRules, PheremoneType, AgentType, AntState } from "./types";


export type { Walker };
export type { Ant };
export type { SimulationWorld };
export type { Simulation };
export type { PheremoneRules };
export type { WalkerState };
export type { ParametersType };
export type { ConfigType };
export { ChoiceType };
export {AntDecisionModeType};
export type { AntState };
export {PheremoneType};
export {AgentType};

export function getStaticParams(): Readonly<ParametersType> {
    return {...staticParameters()};
}


/** User should not be able to modify config from here. 
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
export function getConfig(): Readonly<ConfigType> {
    console.log("Get config");
    return {...walkerConfig()};
}

export function setVariableParams(walkerConfig: ConfigType) {
    setVariableParameters(walkerConfig);
}

export function createSimulation(params: Partial<ParametersType>): Simulation{
    return new Simulation(params);
}
  
export default {
    getConfig,
    getStaticParams,
    createSimulation,
};

