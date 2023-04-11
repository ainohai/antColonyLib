import { antConfig, staticParameters } from "./config/antConfig";
import { Simulation } from "./logic/Simulation";
import { AntState, LastChoice } from "./types";
export { AntState };
export { LastChoice };
export function getStaticParams() {
    return { ...staticParameters() };
}
export function getVariableParams() {
    return antConfig();
}
/** User should not be able to modify config from here.
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
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
