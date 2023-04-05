"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimulation = exports.getConfig = exports.getStaticParams = exports.AntState = void 0;
const antConfig_1 = require("./config/antConfig");
const Simulation_1 = require("./logic/Simulation");
const types_1 = require("./types");
Object.defineProperty(exports, "AntState", { enumerable: true, get: function () { return types_1.AntState; } });
function getStaticParams() {
    return Object.assign({}, (0, antConfig_1.staticParameters)());
}
exports.getStaticParams = getStaticParams;
/** User should not be able to modify  */
function getConfig() {
    return Object.assign({}, (0, antConfig_1.antConfig)());
}
exports.getConfig = getConfig;
function createSimulation(params, variableParams) {
    return new Simulation_1.Simulation(params, variableParams);
}
exports.createSimulation = createSimulation;
exports.default = {
    getConfig,
    getStaticParams,
    createSimulation,
};
