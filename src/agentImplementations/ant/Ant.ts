import { walkerConfig } from "../../config/walkerConfig";
import { WalkerAction, AntDecisionModeType, WalkerPheremone, ChoiceType, DirectionScore, PheremoneType, AntState, AgentType } from "../../types";
import { Walker } from "../../entities/Walker";
import { Cell, SimulationWorld as SimulationWorld } from "../../entities/World";
import { Food } from '../../entities/Agent';
import { modeActions } from "./AntState";


const initialState: AntState = {
    lockedInStateUntilTick: undefined,
    startedInStateOnTick: 0,
    hasFood: false,
    mode: AntDecisionModeType.SEARCHING_FOOD,
    lastChoice: ChoiceType.UNKNOWN,
    history: [] 
}
const initialPheremone: WalkerPheremone = {
    type: PheremoneType.HOME,
    pickedUpPheremoneOnTick: 0
}


export class Ant extends Walker {

    id: Readonly<string>; // for saving simulation results. 

    constructor(x: number, y: number, id: string) {
        super(x, y, initialState, initialPheremone);
        this.randomizeDirection();
        this.id = id;
    }

    deleteMe(): boolean {
        return false;
    }

    protected moveActions(newLocation: [number, number], action: WalkerAction, currentTick: number, world: SimulationWorld) {
        if (!!newLocation) {

            if (world.getTypeFromCell(AgentType.HOME, newLocation).length > 0) {
                action = this.foundHome(currentTick);
            }
            const food = world.getTypeFromCell(AgentType.FOOD, newLocation) as Food[];
            if (food.length > 0) {

                action = this.foundFood(food[0], currentTick);
            }

            if (!!this.pheremone?.type !== undefined && this.pheremone?.pickedUpPheremoneOnTick !== undefined) {
                const cell = world.getCell(newLocation[0], newLocation[1]);
                if (!cell) {
                    throw `Illegal cell for pheremones: (${newLocation[0]}, ${newLocation[1]})`
                }
                cell.addPheremone(this.pheremone?.type, this.pheremone?.pickedUpPheremoneOnTick, currentTick);
            }

            this.history.shift();
            this.history.push([...newLocation]);
            
        }

        if (this.state.lockedInStateUntilTick === currentTick) {
            (this.state as AntState).mode = (this.state as AntState).hasFood ? AntDecisionModeType.SEARHCING_HOME : AntDecisionModeType.SEARCHING_FOOD;
            this.state.lockedInStateUntilTick = undefined;
            this.state.startedInStateOnTick = currentTick;
        }

        return action;
    }

    private foundHome(tick: number): WalkerAction {
        let action = WalkerAction.NO_ACTION;
        if ((this.state as AntState).mode === AntDecisionModeType.SEARHCING_HOME) {
            action = WalkerAction.NESTED_FOOD;
            (this.state as AntState).mode = AntDecisionModeType.SEARCHING_FOOD;
            (this.state as AntState).hasFood = false;
            this.turnAround();
            this.state.startedInStateOnTick = tick;
            this.pheremone = { pickedUpPheremoneOnTick: tick, type: PheremoneType.HOME }
        }
        //Should we count steps from home, if walker is looking for home?? No


        return action;
    }

    //todo: Contains magic numbers.
    protected pickNextDirection(world: SimulationWorld, tick: number): DirectionScore | undefined {

        const random = Math.random();
        if (walkerConfig().walkerAnarchyRandomPercentage * (tick-this.pheremone.pickedUpPheremoneOnTick)/1000 && random <= walkerConfig().walkerAnarchyRandomPercentage) {
            //console.log("anarcgy: " + walkerConfig().walkerAnarchyRandomPercentage);

            this.randomizeDirection();
            this.state.lockedInStateUntilTick = tick + 20;
            this.state.startedInStateOnTick = tick;
            (this.state as AntState).mode = AntDecisionModeType.ANARCHY;
        }

        const actions = modeActions((this.state as AntState).mode);
        const chosen = actions.choose(this, world, tick);

        return chosen;
    }


    private foundFood(food: Food, tick: number) {
        let action = WalkerAction.NO_ACTION;
        if ((this.state as AntState).mode === AntDecisionModeType.SEARCHING_FOOD) {

            const didEat = food.reduceFood();

            if (didEat) {
                this.turnAround();
                (this.state as AntState).mode = AntDecisionModeType.SEARHCING_HOME;
                (this.state as AntState).hasFood = true;
                this.state.startedInStateOnTick = tick;
                action = WalkerAction.FOUND_FOOD;
                this.pheremone = { pickedUpPheremoneOnTick: tick, type: PheremoneType.SUGAR }
            }
        }

        return action;
    }
}
