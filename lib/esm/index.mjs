import { antConfig, staticParameters } from "./config/antConfig";
import { Simulation } from "./logic/Simulation";
import { AntState } from "./types";
export { AntState };
export function getStaticParams() {
    return { ...staticParameters() };
}
/** User should not be able to modify  */
export function getConfig() {
    return { ...antConfig() };
}
export function createSimulation(params, variableParams) {
    return new Simulation(params, variableParams);
}
export default {
    getConfig,
    getStaticParams,
    createSimulation,
};
