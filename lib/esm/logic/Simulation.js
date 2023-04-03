import { Ant } from '../entities/Ant';
import { AntWorld } from '../entities/World';
import { setStaticParameters } from "../config/antConfig";
export class Simulation {
    tick;
    state;
    constructor(params) {
        this.tick = 0;
        const config = setStaticParameters(params);
        this.state = {
            ants: [],
            world: new AntWorld(config.COLUMNS, config.ROWS)
        };
        const home = this.state.world.getHomeCoord();
        for (let i = 0; i < config.NUM_OF_ANTS; i++) {
            this.state.ants.push(new Ant(home[0], home[1]));
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
