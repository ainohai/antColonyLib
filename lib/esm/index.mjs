import { antConfig, staticParameters } from "./config/antConfig";
import { Simulation } from "./logic/Simulation";
import { AntState } from "./types";
export { AntState };
export function getStaticParams() {
    return { ...staticParameters() };
}
export function setVariableParameters(config) {
    setVariableParameters(config);
}
//Todo: User should not be able to modify the config from here!
export function getConfig() {
    return { ...antConfig };
}
export function createSimulation(params) {
    return new Simulation(params);
}
export default {
    setVariableParameters,
    getConfig,
    getStaticParams,
    createSimulation,
};
