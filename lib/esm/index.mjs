import { antConfig, setAntConfig, staticParameters } from "./antConfig";
import { AntState } from "./entities/Ant";
import { Simulation } from "./logic/Simulation";
export { AntState };
export function setConfig(config) {
    setAntConfig(config);
}
//Todo: User should not be able to modify the config from here!
export function getConfig() {
    return antConfig;
}
export function getStaticParams() {
    return staticParameters;
}
export function createSimulation(width, height) {
    return new Simulation(width, height);
}
export default {
    setConfig,
    getConfig,
    getStaticParams,
    createSimulation,
};
