import { configType as VariableConfigType, ParametersType } from "../types";
export declare const staticParameters: () => Readonly<ParametersType>;
/** Use once before starting the simulation. */
export declare const setStaticParameters: (parameters: Partial<ParametersType>) => Readonly<ParametersType>;
export declare const antConfig: () => Readonly<VariableConfigType>;
/** Can be used during the simulation */
export declare const setVariableParameters: (configs: Partial<VariableConfigType>) => Readonly<VariableConfigType>;
//# sourceMappingURL=antConfig.d.ts.map