"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimulation = exports.getConfig = exports.setVariableParameters = exports.getStaticParams = exports.AntState = void 0;
const antConfig_1 = require("./config/antConfig");
const Simulation_1 = require("./logic/Simulation");
const types_1 = require("./types");
Object.defineProperty(exports, "AntState", { enumerable: true, get: function () { return types_1.AntState; } });
function getStaticParams() {
    return Object.assign({}, (0, antConfig_1.staticParameters)());
}
exports.getStaticParams = getStaticParams;
function setVariableParameters(config) {
    setVariableParameters(config);
}
exports.setVariableParameters = setVariableParameters;
//Todo: User should not be able to modify the config from here!
function getConfig() {
    return Object.assign({}, antConfig_1.antConfig);
}
exports.getConfig = getConfig;
function createSimulation(params) {
    return new Simulation_1.Simulation(params);
}
exports.createSimulation = createSimulation;
exports.default = {
    setVariableParameters,
    getConfig,
    getStaticParams,
    createSimulation,
};
