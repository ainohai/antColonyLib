import { walkerConfig } from "../../config/walkerConfig";
import { walkerAction, AntDecisionModeType, ChoiceType, PheremoneType, AgentType } from "../../types";
import { Walker } from "../../entities/Walker";
import { modeActions } from "./AntState";
const initialState = {
    lockedInStateUntilTick: undefined,
    startedInStateOnTick: 0,
    hasFood: false,
    mode: AntDecisionModeType.SEARCHING_FOOD,
    lastChoice: ChoiceType.UNKNOWN
};
const initialPheremone = {
    type: PheremoneType.HOME,
    pickedUpPheremoneOnTick: 0
};
export class Ant extends Walker {
    id; // for saving simulation results. 
    constructor(x, y, id) {
        super(x, y, initialState, initialPheremone);
        this.randomizeDirection();
        this.id = id;
    }
    deleteMe() {
        return false;
    }
    moveActions(newLocation, action, currentTick, world) {
        if (!!newLocation) {
            if (world.getTypeFromCell(AgentType.HOME, newLocation).length > 0) {
                action = this.foundHome(currentTick);
            }
            const food = world.getTypeFromCell(AgentType.FOOD, newLocation);
            if (food.length > 0) {
                action = this.foundFood(food[0], currentTick);
            }
            if (!!this.pheremone?.type !== undefined && this.pheremone?.pickedUpPheremoneOnTick !== undefined) {
                const cell = world.getCell(newLocation[0], newLocation[1]);
                if (!cell) {
                    throw `Illegal cell for pheremones: (${newLocation[0]}, ${newLocation[1]})`;
                }
                cell.addPheremone(this.pheremone?.type, this.pheremone?.pickedUpPheremoneOnTick, currentTick);
            }
        }
        const random = Math.random();
        if (walkerConfig().walkerAnarchyRandomPercentage && random <= walkerConfig().walkerAnarchyRandomPercentage) {
            console.log("anarcgy: " + walkerConfig().walkerAnarchyRandomPercentage);
            this.randomizeDirection();
            this.state.lockedInStateUntilTick = currentTick + 10;
            this.state.startedInStateOnTick = currentTick;
            this.state.mode = AntDecisionModeType.ANARCHY;
        }
        if (this.state.lockedInStateUntilTick === currentTick) {
            this.state.mode = this.state.hasFood ? AntDecisionModeType.SEARHCING_HOME : AntDecisionModeType.SEARCHING_FOOD;
            this.state.lockedInStateUntilTick = undefined;
            this.state.startedInStateOnTick = currentTick;
        }
        return action;
    }
    foundHome(tick) {
        let action = walkerAction.NO_ACTION;
        if (this.state.mode === AntDecisionModeType.SEARHCING_HOME) {
            action = walkerAction.NESTED_FOOD;
            this.state.mode = AntDecisionModeType.SEARCHING_FOOD;
            this.state.hasFood = false;
            this.turnAround();
            this.state.startedInStateOnTick = tick;
            this.pheremone = { pickedUpPheremoneOnTick: tick, type: PheremoneType.HOME };
        }
        //Should we count steps from home, if walker is looking for home??
        return action;
    }
    pickNextDirection(world, tick) {
        const actions = modeActions(this.state.mode);
        const chosen = actions.chosen(this, world, tick);
        return chosen;
    }
    foundFood(food, tick) {
        let action = walkerAction.NO_ACTION;
        if (this.state.mode === AntDecisionModeType.SEARCHING_FOOD) {
            this.state.mode = AntDecisionModeType.SEARHCING_HOME;
            this.state.hasFood = true;
            this.turnAround();
            food.reduceFood();
            this.state.startedInStateOnTick = tick;
            action = walkerAction.FOUND_FOOD;
            this.pheremone = { pickedUpPheremoneOnTick: tick, type: PheremoneType.SUGAR };
        }
        return action;
    }
}
