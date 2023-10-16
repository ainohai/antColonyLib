import { Ant } from "../agentImplementations/ant/Ant";
import { setStaticParameters } from "../config/walkerConfig";
import { SimulationWorld } from "../entities/World";
import { AgentType } from '../types';
const numOfFood = 100;
export class Simulation {
    tick;
    state;
    constructor(params) {
        this.tick = 0;
        const config = setStaticParameters(params);
        this.state = {
            world: new SimulationWorld(config.COLUMNS, config.ROWS),
        };
        const home = this.state.world.getHomeCoord();
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) + 135, Math.floor(config.ROWS / 2) + 135, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) - 220, Math.floor(config.ROWS / 2) + 35, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS / 2) - 5, Math.floor(config.ROWS / 2) + 80, numOfFood / 2);
        for (let i = 0; i < config.NUM_OF_WALKERS; i++) {
            const ant = new Ant(home[0], home[1], `ant-${i}`);
            this.state.world.setAgent(home[0], home[1], ant, AgentType.WALKER);
        }
    }
    run() {
        this.tick++;
        const walkers = this.state.world.getType(AgentType.WALKER);
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
