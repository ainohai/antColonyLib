import { walkerConfig, setVariableParameters, staticParameters } from "./config/walkerConfig";
import { Simulation } from "./logic/Simulation";
import { AntDecisionModeType, ChoiceType, PheremoneType, AgentType } from "./types";
export { ChoiceType };
export { AntDecisionModeType };
export { PheremoneType };
export { AgentType };
export function getStaticParams() {
    return { ...staticParameters() };
}
/** User should not be able to modify config from here.
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
export function getConfig() {
    console.log("Get config");
    return { ...walkerConfig() };
}
export function setVariableParams(walkerConfig) {
    setVariableParameters(walkerConfig);
}
export function createSimulation(params) {
    return new Simulation(params);
}
export default {
    getConfig,
    getStaticParams,
    createSimulation,
};
