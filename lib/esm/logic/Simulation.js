import { Ant } from '../entities/Ant';
import { AntWorld } from '../entities/World';
import { staticParameters } from "../antConfig";
export class Simulation {
    tick;
    state;
    constructor(columns, rows) {
        this.tick = 0;
        this.state = {
            ants: [],
            world: new AntWorld(columns, rows)
        };
        const home = this.state.world.getHomeCoord();
        for (let i = 0; i < staticParameters.NUM_OF_ANTS; i++) {
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
