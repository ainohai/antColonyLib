import { walkerConfig, staticParameters } from "../config/walkerConfig";
import { getIndexWithCoordinate } from "../utils/coordinateUtil";
import { SimulationWorld } from "./World";
import { WalkerAction, WalkerState, ChoiceType, Coordinate, Direction, directions, DirectionScore, WalkerPheremone } from "../types";
import { Agent } from "./Agent";


export interface WalkerInterface {
    ageLeft: number;
    currentAngle: number; 
    state: WalkerState;
    //Only one pheremone at time, could be more.
    pheremone: WalkerPheremone | undefined;
    initialState: WalkerState
    initialPheremone: WalkerPheremone | undefined;
    simulate(world: SimulationWorld, currentTick: number): WalkerAction;
    move(directions: Direction, world: SimulationWorld): void;
}

export abstract class Walker extends Agent implements WalkerInterface {
    ageLeft: number = 0;
    currentAngle: number = 0; 
    state: WalkerState;
    //Only one pheremone at time, could be more.
    pheremone: WalkerPheremone | undefined;
    initialState: WalkerState
    initialPheremone: WalkerPheremone | undefined;
    history: any[][];
    

    constructor(x: number, y: number, walkerState: WalkerState, initialPheremone: WalkerPheremone|undefined) {
        super([x, y]);
        this.ageLeft = walkerConfig().walkerLifespan;
        this.initialState = walkerState
        this.state = {...this.initialState};
        this.pheremone = !!initialPheremone ? {...initialPheremone} : undefined;
        this.initialPheremone = initialPheremone;
        this.history = [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]];
    }

    get isDead() {
        return this.ageLeft <= 0;
    }

    respawnAtCell(homeCoord: Coordinate) {
        this.location[0] = homeCoord[0];
        this.location[1] = homeCoord[1];
        this.state = this.initialState;
        this.pheremone = !!this.initialPheremone ? {...this.initialPheremone} : undefined;
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

    move = (directions: Direction, world: SimulationWorld) => {
        world.moveInTheWorld(this.location, directions);
    }

    moveIntoNewLocation(world: SimulationWorld, tick:number, chosen: DirectionScore): [number, number] {
        
        //Move the walker. 
        if (!!chosen && chosen.score >= 0) {
            this.move(directions[chosen.direction], world);
            this.currentAngle = chosen.direction;
            this.state.lastChoice = chosen.choiceType ?? ChoiceType.UNKNOWN;
        }
        else {
            //Randomize direction and try again next round
            this.randomizeDirection();
            this.state.lastChoice =  ChoiceType.UNKNOWN;
            console.log("Randomized")
        }

        const newLocation: [number, number] = [this.location[0], this.location[1]];

        if (!newLocation) {
            throw new Error(`No cell found for walker in (${this.location[0]}, ${this.location[1]}) 
            with index ${getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, this.location[0], this.location[1])}`);
        }

        return newLocation;
    }

    protected abstract pickNextDirection(world: SimulationWorld, tick: number):DirectionScore|undefined;

    simulate(world: SimulationWorld, currentTick: number): WalkerAction {
                    
        let action = WalkerAction.NO_ACTION;

        if (this.isDead) {
            if (this.shouldRespawn()) {
                this.respawnAtCell(world.getHomeIndexes());
                }
            return action;
        }
        
        const chosen = this.pickNextDirection(world, currentTick);

        let newLocation: [number, number] = this.moveIntoNewLocation(world, currentTick, chosen);
        
        action = this.moveActions(newLocation, action, currentTick, world);

        this.ageLeft = this.ageLeft - 1;

        return action;
    }

    protected abstract moveActions(newLocation: [number, number], action: WalkerAction, currentTick: number, world: SimulationWorld): WalkerAction;

}
