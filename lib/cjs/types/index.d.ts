import { Ant } from "./agentImplementations/ant/Ant";
import { Walker } from "./entities/Walker";
import { SimulationWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";
import { AntDecisionModeType, WalkerState, ChoiceType, ConfigType, ParametersType, PheremoneRules, PheremoneType, AgentType, AntState } from "./types";
export type { Walker };
export type { Ant };
export type { SimulationWorld };
export type { Simulation };
export type { PheremoneRules };
export { WalkerState };
export type { ParametersType };
export type { ConfigType };
export { ChoiceType };
export { AntDecisionModeType };
export { AntState };
export { PheremoneType };
export { AgentType };
export declare function getStaticParams(): Readonly<ParametersType>;
/** User should not be able to modify config from here.
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
export declare function getConfig(): Readonly<ConfigType>;
export declare function setVariableParams(walkerConfig: ConfigType): void;
export declare function createSimulation(params: Partial<ParametersType>): Simulation;
declare const _default: {
    getConfig: typeof getConfig;
    getStaticParams: typeof getStaticParams;
    createSimulation: typeof createSimulation;
};
export default _default;
//# sourceMappingURL=index.d.ts.map