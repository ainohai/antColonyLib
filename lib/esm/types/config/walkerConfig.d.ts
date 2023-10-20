import { ConfigType as VariableConfigType, ParametersType } from "../types";
export declare const staticParameters: () => Readonly<ParametersType>;
/** Use once before starting the simulation. */
export declare const setStaticParameters: (parameters: Partial<ParametersType>) => Readonly<ParametersType>;
export declare const walkerConfig: () => VariableConfigType;
/** Can be used during the simulation */
export declare const setVariableParameters: (configs: VariableConfigType) => Readonly<VariableConfigType>;
//# sourceMappingURL=walkerConfig.d.ts.map