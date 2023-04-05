import { Ant } from '../entities/Ant';
import { AntWorld } from '../entities/World';
import { setStaticParameters, setVariableParameters } from "../config/antConfig";
import { AntAction, ConfigType, ParametersType, SimulationState } from '../types';

const numOfFood = 1000;

export class Simulation {
    tick: number;
    state: SimulationState

    constructor(params: Partial<ParametersType>, variableParams: Partial<ConfigType>) {
        this.tick = 0;

        const config = setStaticParameters(params)
        this.state = {
            ants: [],
            world: new AntWorld(config.COLUMNS, config.ROWS),
            statistics: {
                totalFoods: 0,
                foodsPicked: 0,
                foodsInNest: 0
            }
        };

        setVariableParameters(variableParams);

        const home = this.state.world.getHomeCoord();
        this.state.world.setFood(Math.floor(config.COLUMNS/2) + 135, Math.floor(config.ROWS/2) + 135, numOfFood);
        this.state.statistics.totalFoods += numOfFood;

        for (let i = 0; i < config.NUM_OF_ANTS; i++) {
            this.state.ants.push(new Ant(home[0], home[1]));
        }
    }

    run() {
        
        this.tick++;

        for (var i = 0; i < this.state.ants.length; i++) {

            const ant = this.state.ants[i];
            const takenAction = ant.simulateAnt(this.state.world, this.tick);
            
            if (takenAction === AntAction.FOUND_FOOD) {
                this.state.statistics.foodsPicked += 1;    
            }
            else if (takenAction === AntAction.NESTED_FOOD) {
                this.state.statistics.foodsInNest += 1;    
            }
        }

        return this.state;
    }

    getState(): SimulationState  {
        return this.state;
    }
}