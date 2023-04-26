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
export { AntDecisionModeType };
export declare function getStaticParams(): Readonly<ParametersType>;
/** User should not be able to modify config from here.
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
export declare function getConfig(): Readonly<ConfigType>;
export declare function setVariableParams(antConfig: ConfigType): void;
export declare function createSimulation(params: Partial<ParametersType>): Simulation;
declare const _default: {
    getConfig: typeof getConfig;
    getStaticParams: typeof getStaticParams;
    createSimulation: typeof createSimulation;
};
export default _default;
//# sourceMappingURL=index.d.ts.map