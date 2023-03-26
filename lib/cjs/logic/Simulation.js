"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
const Ant_1 = require("../entities/Ant");
const World_1 = require("../entities/World");
const antConfig_1 = require("../antConfig");
class Simulation {
    constructor(columns, rows) {
        this.tick = 0;
        this.state = {
            ants: [],
            world: new World_1.AntWorld(columns, rows)
        };
        const home = this.state.world.getHomeCoord();
        for (let i = 0; i < antConfig_1.staticParameters.NUM_OF_ANTS; i++) {
            this.state.ants.push(new Ant_1.Ant(home[0], home[1]));
        }
    }
    run() {
        this.tick++;
        for (var i = 0; i < this.state.ants.length; i++) {
            const ant = this.state.ants[i];
            ant.simulateAnt(this.state.world, this.tick);
        }
        return this.getState();
    }
    getState() {
        return this.state;
    }
}
exports.Simulation = Simulation;
