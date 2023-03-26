import { configType } from "./antConfig";
import { Ant, AntState } from "./entities/Ant";
import { AntWorld } from "./entities/World";
import { Simulation } from "./logic/Simulation";
export type { Ant };
export type { AntWorld };
export type { Simulation };
export { AntState };
export declare function setConfig(config: configType): void;
export declare function getConfig(): configType;
export declare function getStaticParams(): Readonly<{
    COLUMNS: number;
    ROWS: number;
    RESPAWN_PERCENTAGE: number;
    NUM_OF_ANTS: number;
}>;
export declare function createSimulation(width: number, height: number): Simulation;
declare const _default: {
    setConfig: typeof setConfig;
    getConfig: typeof getConfig;
    getStaticParams: typeof getStaticParams;
    createSimulation: typeof createSimulation;
};
export default _default;
//# sourceMappingURL=index.d.ts.map