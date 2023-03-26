"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimulation = exports.getStaticParams = exports.getConfig = exports.setConfig = exports.AntState = void 0;
const antConfig_1 = require("./antConfig");
const Ant_1 = require("./entities/Ant");
Object.defineProperty(exports, "AntState", { enumerable: true, get: function () { return Ant_1.AntState; } });
const Simulation_1 = require("./logic/Simulation");
function setConfig(config) {
    (0, antConfig_1.setAntConfig)(config);
}
exports.setConfig = setConfig;
//Todo: User should not be able to modify the config from here!
function getConfig() {
    return antConfig_1.antConfig;
}
exports.getConfig = getConfig;
function getStaticParams() {
    return antConfig_1.staticParameters;
}
exports.getStaticParams = getStaticParams;
function createSimulation(width, height) {
    return new Simulation_1.Simulation(width, height);
}
exports.createSimulation = createSimulation;
exports.default = {
    setConfig,
    getConfig,
    getStaticParams,
    createSimulation,
};
