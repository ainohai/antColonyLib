"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimulation = exports.setVariableParams = exports.getConfig = exports.getStaticParams = exports.AgentType = exports.PheremoneType = exports.AntDecisionModeType = exports.ChoiceType = void 0;
const walkerConfig_1 = require("./config/walkerConfig");
const Simulation_1 = require("./logic/Simulation");
const types_1 = require("./types");
Object.defineProperty(exports, "AntDecisionModeType", { enumerable: true, get: function () { return types_1.AntDecisionModeType; } });
Object.defineProperty(exports, "ChoiceType", { enumerable: true, get: function () { return types_1.ChoiceType; } });
Object.defineProperty(exports, "PheremoneType", { enumerable: true, get: function () { return types_1.PheremoneType; } });
Object.defineProperty(exports, "AgentType", { enumerable: true, get: function () { return types_1.AgentType; } });
function getStaticParams() {
    return Object.assign({}, (0, walkerConfig_1.staticParameters)());
}
exports.getStaticParams = getStaticParams;
/** User should not be able to modify config from here.
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
function getConfig() {
    console.log("Get config");
    return Object.assign({}, (0, walkerConfig_1.walkerConfig)());
}
exports.getConfig = getConfig;
function setVariableParams(walkerConfig) {
    (0, walkerConfig_1.setVariableParameters)(walkerConfig);
}
exports.setVariableParams = setVariableParams;
function createSimulation(params) {
    return new Simulation_1.Simulation(params);
}
exports.createSimulation = createSimulation;
exports.default = {
    getConfig,
    getStaticParams,
    createSimulation,
};
