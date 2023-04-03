import { Ant } from "./entities/Ant";
import { AntWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";
import { AntState, configType, ParametersType } from "./types";
export type { Ant };
export type { AntWorld };
export type { Simulation };
export { AntState };
export type { ParametersType };
export declare function getStaticParams(): Readonly<ParametersType>;
export declare function setVariableParameters(config: configType): void;
export declare function getConfig(): {};
export declare function createSimulation(params: Partial<ParametersType>): Simulation;
declare const _default: {
    setVariableParameters: typeof setVariableParameters;
    getConfig: typeof getConfig;
    getStaticParams: typeof getStaticParams;
    createSimulation: typeof createSimulation;
};
export default _default;
//# sourceMappingURL=index.d.ts.map