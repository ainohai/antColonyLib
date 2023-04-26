"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulation = void 0;
const Ant_1 = require("../entities/Ant");
const World_1 = require("../entities/World");
const antConfig_1 = require("../config/antConfig");
const types_1 = require("../types");
const numOfFood = 100;
class Simulation {
    constructor(params) {
        this.tick = 0;
        const config = (0, antConfig_1.setStaticParameters)(params);
        this.state = {
            ants: [],
            world: new World_1.AntWorld(config.COLUMNS, config.ROWS),
            statistics: {
                totalFoods: 0,
                foodsPicked: 0,
                foodsInNest: 0
            }
        };
        const home = this.state.world.getHomeCoord();
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) + 135, Math.floor(config.ROWS / 2) + 135, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) - 220, Math.floor(config.ROWS / 2) + 35, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) - 5, Math.floor(config.ROWS / 2) + 80, numOfFood / 2);
        this.state.statistics.totalFoods = numOfFood + numOfFood + numOfFood / 2;
        for (let i = 0; i < config.NUM_OF_ANTS; i++) {
            this.state.ants.push(new Ant_1.Ant(home[0], home[1], `ant-${i}`));
        }
    }
    run() {
        this.tick++;
        for (var i = 0; i < this.state.ants.length; i++) {
            const ant = this.state.ants[i];
            const takenAction = ant.simulateAnt(this.state.world, this.tick);
            if (takenAction === types_1.AntAction.FOUND_FOOD) {
                this.state.statistics.foodsPicked += 1;
            }
            else if (takenAction === types_1.AntAction.NESTED_FOOD) {
                this.state.statistics.foodsInNest += 1;
            }
        }
        return this.state;
    }
    getState() {
        return this.state;
    }
}
exports.Simulation = Simulation;
