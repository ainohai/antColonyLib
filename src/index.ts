import { antConfig, configType, setAntConfig, staticParameters } from "./antConfig";
import { Ant, AntState } from "./entities/Ant";
import { AntWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";


export type { Ant };
export type { AntWorld };
export type { Simulation };
export { AntState };

export function setConfig(config: configType) {
    setAntConfig(config);
}

//Todo: User should not be able to modify the config from here!
export function getConfig() {
    return antConfig;
}

export function getStaticParams() {
    return staticParameters;
}
  
export function createSimulation(width: number, height: number): Simulation{
    return new Simulation(width, height);
}
  
export default {
    setConfig,
    getConfig,
    getStaticParams,
    createSimulation,
};

