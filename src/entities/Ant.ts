import { directions, Direction, directionsForward, directionsLeft, directionsRight } from "../logic/directions";
import { getScoreForDirection } from "../logic/scoring";
import { antConfig, CellStates, staticParameters } from "../antConfig";
import { getIndexWithCoordinate } from "../utils/coordinateUtil";
import { AntWorld, Cell } from "./World";


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


export type Coordinate = [
    x: number, 
    y: number
]

export type DirectionScore = {direction: Direction, score: number}

export enum AntState {
    SEARCH_FOOD,
    CARRY_FOOD
}

export class Ant {
    location: Coordinate;
    age: number = 0;
    currentAngle: number = 0; 
    state: AntState = AntState.SEARCH_FOOD;
    stepsFromHome: number = 0;
    stepsFromFood: number | undefined = undefined;
    
    //For perf reasons. Would some buffer implementation be nice? We only should need one at time, as long as we are not doing things concurrently.
    private directionScores: DirectionScore[] = [];

    constructor(x: number, y: number) {
        this.location = [x, y];
        this.randomizeDirection();
        //Right, forward left
        for (let i = 0; i < 3; i++) {
            this.directionScores.push({direction: directionsForward(this.currentAngle), score: 0 });
        }
    }

    get isDead() {
        return this.age > antConfig.antLifespan;
    }

    respawnAtCell(homeCoord: Coordinate) {
        this.location[0] = homeCoord[0];
        this.location[1] = homeCoord[1];
        this.state = AntState.SEARCH_FOOD;
        this.randomizeDirection();
        this.age = 0;
        this.stepsFromFood = undefined;
        this.stepsFromHome = 0;
    }

    shouldRespawn() {
        return (Math.random() * 100) < staticParameters.RESPAWN_PERCENTAGE;
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
        
        const directions: Direction[] = [directionsForward(this.currentAngle), directionsLeft(this.currentAngle), directionsRight(this.currentAngle)];
        const scores =  this.score(directions, world, tick);

        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score});
        
        let chosen: DirectionScore|undefined = scores[0];

        //If no direction is particularly good, move at random.
        //There's also a 20% chance the ant moves randomly even 
        //if there is an optimal direction,
        //just to give them a little more interesting behavior.
        const random = Math.random();
        if (random <= antConfig.moveForwardPercentage && forward.score >= 0) {
            chosen = forward;
        }
        else if (random > antConfig.moveForwardPercentage && random < (antConfig.moveRandomPercentage + antConfig.moveForwardPercentage)) {
            const positiveScores = scores.filter(s => s.score > 0);
            chosen = positiveScores.length > 0 ? positiveScores[Math.floor(Math.random() * positiveScores.length)] : undefined;
        }

        //Move the ant. 
        if (!!chosen && chosen.score >= 0) {
            this.move(chosen.direction, world);
        }
        else {
            //Randomize direction and try again next round
            this.randomizeDirection();
        }

        const newLocation = world.getCell(this.location[0], this.location[1]);

        if (!newLocation) {
            throw new Error(`No cell found for ant in (${this.location[0]}, ${this.location[1]}) 
            with index ${getIndexWithCoordinate(staticParameters.COLUMNS, staticParameters.ROWS, this.location[0], this.location[1])}`);
        }

        this.stepsFromHome += 1;
        this.stepsFromFood = this.stepsFromFood === undefined ? undefined : this.stepsFromFood + 1;

        return newLocation;
    }

    simulateAnt(world: AntWorld, currentTick: number) {
                    
        if (this.isDead) {
            if (this.shouldRespawn()) {
                this.respawnAtCell(world.getHomeCoord());
                }
            return;
        }
        
        let newLocation: Cell = this.exploreWorld(world, currentTick);
        
        if (!!newLocation) {

            if (newLocation.type === CellStates.HOME) {
                this.foundHome();
            }
            else if (newLocation.type === CellStates.FOOD) {
                this.foundFood(newLocation);
            }

        newLocation.addPheremone(this.stepsFromHome, this.stepsFromFood, currentTick);
        }
        else {
            this.age = antConfig.antLifespan + 1;
        }

        this.age++;
    }


    private score(directions: Direction[], world: AntWorld, tick: number): DirectionScore[] {

        const scores: DirectionScore[] = this.directionScores;

        directions.forEach((direction, index) => { 
            //We are reusing the old object here for performance reasons. This is not elegant, but hopefully more efficient. 
            let score = scores[index];
            score.direction = direction,
            score.score = getScoreForDirection(direction, this.location, this.state, world, tick)}
            );
        return scores;
    }

    private foundHome() {
        if (this.state === AntState.CARRY_FOOD) {
            this.state = AntState.SEARCH_FOOD;
            this.turnAround(); 
        }
        this.stepsFromHome = 0;
    }

    private foundFood(location: Cell) {
        if (this.state === AntState.SEARCH_FOOD) {
            this.state = AntState.CARRY_FOOD;
            this.turnAround();
            location.reduceFood();
        }
        this.stepsFromFood = 0;
    }
}
