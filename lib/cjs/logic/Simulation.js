"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
const Ant_1 = require("../agentImplementations/ant/Ant");
const walkerConfig_1 = require("../config/walkerConfig");
const World_1 = require("../entities/World");
const types_1 = require("../types");
const numOfFood = 100;
class Simulation {
    constructor(params) {
        this.tick = 0;
        const config = (0, walkerConfig_1.setStaticParameters)(params);
        this.state = {
            world: new World_1.SimulationWorld(config.COLUMNS, config.ROWS),
        };
        const home = this.state.world.getHomeCoord();
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) + 135, Math.floor(config.ROWS / 2) + 135, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) - 220, Math.floor(config.ROWS / 2) + 35, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) - 5, Math.floor(config.ROWS / 2) + 80, numOfFood / 2);
        for (let i = 0; i < config.NUM_OF_WALKERS; i++) {
            const ant = new Ant_1.Ant(home[0], home[1], `ant-${i}`);
            this.state.world.setAgent(home[0], home[1], ant, types_1.AgentType.WALKER);
        }
    }
    run() {
        this.tick++;
        const walkers = this.state.world.getType(types_1.AgentType.WALKER);
        for (var i = 0; i < walkers.length; i++) {
            const walker = walkers[i];
            const takenAction = walker.simulate(this.state.world, this.tick);
        }
        return this.state;
    }
    getState() {
        return this.state;
    }
}
exports.Simulation = Simulation;
