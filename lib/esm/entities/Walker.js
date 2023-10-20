import { walkerConfig, staticParameters } from "../config/walkerConfig";
import { getIndexWithCoordinate } from "../utils/coordinateUtil";
import { walkerAction, ChoiceType, directions } from "../types";
import { Agent } from "./Agent";
export class Walker extends Agent {
    ageLeft = 0;
    currentAngle = 0;
    state;
    //Only one pheremone at time, could be more.
    pheremone;
    initialState;
    initialPheremone;
    constructor(x, y, walkerState, initialPheremone) {
        super([x, y]);
        this.ageLeft = walkerConfig().walkerLifespan;
        this.initialState = walkerState;
        this.state = { ...this.initialState };
        this.pheremone = !!initialPheremone ? { ...initialPheremone } : undefined;
        this.initialPheremone = initialPheremone;
    }
    get isDead() {
        return this.ageLeft <= 0;
    }
    respawnAtCell(homeCoord) {
        this.location[0] = homeCoord[0];
        this.location[1] = homeCoord[1];
        this.state = this.initialState;
        this.pheremone = !!this.initialPheremone ? { ...this.initialPheremone } : undefined;
        this.randomizeDirection();
        this.ageLeft = walkerConfig().walkerLifespan;
    }
    shouldRespawn() {
        return (Math.random() * 100) < staticParameters().RESPAWN_PERCENTAGE;
    }
    randomizeDirection() {
        this.currentAngle = Math.floor(Math.random() * directions.length);
    }
    turnAround() {
        this.currentAngle = (this.currentAngle + Math.floor(directions.length / 2)) % directions.length;
    }
    move = (directions, world) => {
        world.moveInTheWorld(this.location, directions);
    };
    exploreWorld(world, tick) {
        const chosen = this.pickNextDirection(world, tick);
        //Move the walker. 
        if (!!chosen && chosen.score >= 0) {
            this.move(directions[chosen.direction], world);
            this.currentAngle = chosen.direction;
            this.state.lastChoice = chosen.choiceType ?? ChoiceType.UNKNOWN;
        }
        else {
            //Randomize direction and try again next round
            this.randomizeDirection();
            this.state.lastChoice = ChoiceType.UNKNOWN;
            console.log("Randomized");
        }
        const newLocation = [this.location[0], this.location[1]];
        if (!newLocation) {
            throw new Error(`No cell found for walker in (${this.location[0]}, ${this.location[1]}) 
            with index ${getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, this.location[0], this.location[1])}`);
        }
        return newLocation;
    }
    simulate(world, currentTick) {
        let action = walkerAction.NO_ACTION;
        if (this.isDead) {
            if (this.shouldRespawn()) {
                this.respawnAtCell(world.getHomeCoord());
            }
            return action;
        }
        let newLocation = this.exploreWorld(world, currentTick);
        action = this.moveActions(newLocation, action, currentTick, world);
        this.ageLeft = this.ageLeft - 1;
        return action;
    }
}
