import { antConfig, staticParameters } from "../config/antConfig";
import { getIndexWithCoordinate } from "../utils/coordinateUtil";
import { AntWorld, Cell } from "./World";
import { AntAction, AntDecisionModeType, AntPheremone, AntState, CellStates, ChoiceType, Coordinate, Direction, directions, DirectionScore, PheremoneType } from "../types";
import { modeActions } from "./AntState";


/*
On really unofficial & small scale speed testing (Firefox & Chrome console), it seems like if object is only assessed once, array reading may be bit faster in Firefox,
if multiple times (in a row???), it seems to create some sort of cache in Firefox (relates to how memory manages objects?). On chrome, no significant difference can be seen. 
Anyway, with this test... doesn't seem to matter much how ant locations are saved. 

const testSpeed = () => {
let i = [3, 4];
let j = {x: 3, y: 4};

let x = 3;
let y = 4;

const t0 = performance.now();

for (let f = 0; f <= 10000000000; f++) {
  x = i[0];
  y = i[1]
} 

const t1 = performance.now();
console.log(`Array fetch took ${t1 - t0} milliseconds.`);

for (let d = 0; d <= 10000000000; d++) {
  x = j.x;
  y = j.y
} 

const t2 = performance.now();
console.log(`Object fetch took ${t2 - t1} milliseconds.`);

}

testSpeed();
testSpeed();
testSpeed();
testSpeed();
testSpeed();

=>

Array fetch took 17974 milliseconds. debugger eval code:17:9
Object fetch took 19549 milliseconds. debugger eval code:25:9
Array fetch took 21861 milliseconds. debugger eval code:17:9
Object fetch took 8740 milliseconds. debugger eval code:25:9
Array fetch took 21862 milliseconds. debugger eval code:17:9
Object fetch took 8744 milliseconds. debugger eval code:25:9
Array fetch took 21848 milliseconds. debugger eval code:17:9
Object fetch took 8740 milliseconds. debugger eval code:25:9
Array fetch took 21908 milliseconds. debugger eval code:17:9
Object fetch took 8774 milliseconds. debugger eval code:25:9

and with chrome

Array fetch took 7818.399999856949 milliseconds.VM120:24 
Object fetch took 7812 milliseconds.VM120:16 
Array fetch took 8762.799999952316 milliseconds.VM120:24 
Object fetch took 8782.200000047684 milliseconds.VM120:16 
Array fetch took 29406.599999904633 milliseconds.VM120:24 
Object fetch took 29451.700000047684 milliseconds.VM120:16 
Array fetch took 29623.799999952316 milliseconds.
Object fetch took 29178.099999904633 milliseconds.
 */

const initialState: AntState = {
    lockedInStateUntilTick: undefined,
    startedInStateOnTick: 0,
    hasFood: false,
    mode: AntDecisionModeType.SEARCHING_FOOD, 
    lastChoice: ChoiceType.UNKNOWN
}
const initialPheremone: AntPheremone = {
    type: PheremoneType.HOME,
    pickedUpPheremoneOnTick: 0
}


export class Ant {
    id: Readonly<string>; // for saving simulation results. 
    location: Coordinate;
    ageLeft: number = 0;
    currentAngle: number = 0; 
    state: AntState;
    //Only one pheremone at time, could be more.
    pheremone: AntPheremone | undefined;

    constructor(x: number, y: number, id: string) {
        this.location = [x, y];
        this.randomizeDirection();
        this.ageLeft = antConfig().antLifespan;
        this.state = {...initialState};
        this.pheremone = {...initialPheremone};
        this.id = id
    }

    get isDead() {
        return this.ageLeft <= 0;
    }

    respawnAtCell(homeCoord: Coordinate) {
        this.location[0] = homeCoord[0];
        this.location[1] = homeCoord[1];
        this.state = initialState;
        this.pheremone = initialPheremone;
        this.randomizeDirection();
        this.ageLeft = antConfig().antLifespan;
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

    move = (directions: Direction, world: AntWorld) => {
        world.moveInTheWorld(this.location, directions);
    }

    exploreWorld(world: AntWorld, tick:number): Cell {
        
        const actions = modeActions(this.state.mode);
        const chosen = actions.chosen(this, world, tick);
        
        //Move the ant. 
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

        const newLocation = world.getCell(this.location[0], this.location[1]);

        if (!newLocation) {
            throw new Error(`No cell found for ant in (${this.location[0]}, ${this.location[1]}) 
            with index ${getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, this.location[0], this.location[1])}`);
        }

        return newLocation;
    }

    simulateAnt(world: AntWorld, currentTick: number): AntAction {
                    
        let action = AntAction.NO_ACTION;

        if (this.isDead) {
            if (this.shouldRespawn()) {
                this.respawnAtCell(world.getHomeCoord());
                }
            return action;
        }
        
        let newLocation: Cell = this.exploreWorld(world, currentTick);
        
        action = this.moveActions(newLocation, action, currentTick);

        this.ageLeft = this.ageLeft - 1;

        if(this.state.lockedInStateUntilTick === currentTick) {
            this.state.mode = this.state.hasFood ? AntDecisionModeType.SEARHCING_HOME : AntDecisionModeType.SEARCHING_FOOD;
            this.state.lockedInStateUntilTick = undefined; 
            this.state.startedInStateOnTick = currentTick;
        }

        return action;
    }

    private moveActions(newLocation: Cell, action: AntAction, currentTick: number) {
        if (!!newLocation) {

            if (newLocation.type === CellStates.HOME) {
                action = this.foundHome(currentTick);
            }
            else if (newLocation.type === CellStates.FOOD) {
                action = this.foundFood(newLocation, currentTick);
            }

            if (!!this.pheremone?.type !== undefined && this.pheremone?.pickedUpPheremoneOnTick !== undefined) {
                newLocation.addPheremone(this.pheremone?.type, this.pheremone?.pickedUpPheremoneOnTick, currentTick);
            }
        }

        const random = Math.random();
        if (antConfig().antAnarchyRandomPercentage &&  random <= antConfig().antAnarchyRandomPercentage) {
            console.log("anarcgy: " + antConfig().antAnarchyRandomPercentage);
            
            this.randomizeDirection();
            this.state.lockedInStateUntilTick = currentTick + 10;
            this.state.startedInStateOnTick = currentTick;
            this.state.mode = AntDecisionModeType.ANARCHY;
        }
        return action;
    }

    private foundHome(tick: number): AntAction {
        let action = AntAction.NO_ACTION;
        if (this.state.mode === AntDecisionModeType.SEARHCING_HOME) {
            action = AntAction.NESTED_FOOD;
            this.state.mode = AntDecisionModeType.SEARCHING_FOOD;
            this.state.hasFood = false;
            this.turnAround();
            this.state.startedInStateOnTick = tick;
            this.pheremone = {pickedUpPheremoneOnTick: tick, type: PheremoneType.HOME} 
        }
        //Should we count steps from home, if ant is looking for home??
        

        return action;
    }

    private foundFood(location: Cell, tick: number) {
        let action = AntAction.NO_ACTION;
        if (this.state.mode === AntDecisionModeType.SEARCHING_FOOD) {
            this.state.mode = AntDecisionModeType.SEARHCING_HOME;
            this.state.hasFood = true;
            this.turnAround();
            location.reduceFood();
            this.state.startedInStateOnTick = tick;
            action = AntAction.FOUND_FOOD;
            this.pheremone = {pickedUpPheremoneOnTick: tick, type: PheremoneType.SUGAR} 

        }

        return action;
    }
}
