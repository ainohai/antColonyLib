import { Ant } from "../agentImplementations/ant/Ant";
import { setStaticParameters } from "../config/walkerConfig";
import { Walker } from "../entities/Walker";
import { SimulationWorld } from "../entities/World";
import { ParametersType, SimulationState, AgentType, WalkerAction } from '../types';

const numOfFood = 50;

export class Simulation {
    tick: number;
    state: SimulationState

    constructor(params: Partial<ParametersType>) {
        this.tick = 0;

        const config = setStaticParameters(params)
        this.state = {
            world: new SimulationWorld(config.COLUMNS, config.ROWS),
            statistics: {
                totalFoods: 0,
                foodsPicked: 0,
                foodsInNest: 0
            }
        };

        const home = this.state.world.getHomeIndexes();
        this.state.world.setFood(Math.floor(config.COLUMNS/2) + 135, Math.floor(config.ROWS/2) + 135, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS/2) - 220, Math.floor(config.ROWS/2) + 35, numOfFood);
        this.state.world.setFood(Math.floor(config.COLUMNS/2) - 5, Math.floor(config.ROWS/2) + 80, numOfFood/2);

        for (let i = 0; i < config.NUM_OF_WALKERS; i++) {
            const ant = new Ant(home[0], home[1], `ant-${i}`);
            this.state.world.setAgent(home[0], home[1], ant, AgentType.WALKER);
        }
    }

    run() {
        
        this.tick++;

        const walkers = this.state.world.getType(AgentType.WALKER) as Walker[];

        for (var i = 0; i < walkers.length; i++) {

            const walker = walkers[i];
            const takenAction = walker.simulate(this.state.world, this.tick);
            
            if (takenAction === WalkerAction.FOUND_FOOD) {
                this.state.statistics.foodsPicked += 1;    
            }
            else if (takenAction === WalkerAction.NESTED_FOOD) {
                this.state.statistics.foodsInNest += 1;    
            }
        }

        this.state.world.endTurn();

        return this.state;
    }

    getState(): SimulationState  {
        return this.state;
    }
}