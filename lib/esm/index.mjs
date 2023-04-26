import { antConfig, setVariableParameters, staticParameters } from "./config/antConfig";
import { Simulation } from "./logic/Simulation";
import { AntDecisionModeType, ChoiceType } from "./types";
export { ChoiceType };
export { AntDecisionModeType };
export function getStaticParams() {
    return { ...staticParameters() };
}
/** User should not be able to modify config from here.
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
export function getConfig() {
    console.log("Get config");
    return { ...antConfig() };
}
export function setVariableParams(antConfig) {
    setVariableParameters(antConfig);
}
export function createSimulation(params) {
    return new Simulation(params);
}
export default {
    getConfig,
    getStaticParams,
    createSimulation,
};
