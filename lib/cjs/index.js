"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimulation = exports.setVariableParams = exports.getConfig = exports.getStaticParams = exports.AntDecisionModeType = exports.ChoiceType = void 0;
const antConfig_1 = require("./config/antConfig");
const Simulation_1 = require("./logic/Simulation");
const types_1 = require("./types");
Object.defineProperty(exports, "AntDecisionModeType", { enumerable: true, get: function () { return types_1.AntDecisionModeType; } });
Object.defineProperty(exports, "ChoiceType", { enumerable: true, get: function () { return types_1.ChoiceType; } });
function getStaticParams() {
    return Object.assign({}, (0, antConfig_1.staticParameters)());
}
exports.getStaticParams = getStaticParams;
/** User should not be able to modify config from here.
 * Should be possible to add support for changing the config during simulation by adding a new api method. */
function getConfig() {
    console.log("Get config");
    return Object.assign({}, (0, antConfig_1.antConfig)());
}
exports.getConfig = getConfig;
function setVariableParams(antConfig) {
    (0, antConfig_1.setVariableParameters)(antConfig);
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
