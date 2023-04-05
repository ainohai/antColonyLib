"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ant = void 0;
const directions_1 = require("../logic/directions");
const scoring_1 = require("../logic/scoring");
const antConfig_1 = require("../config/antConfig");
const coordinateUtil_1 = require("../utils/coordinateUtil");
const types_1 = require("../types");
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
class Ant {
    constructor(x, y) {
        this.age = 0;
        this.currentAngle = 0;
        this.state = types_1.AntState.SEARCH_FOOD;
        this.stepsFromHome = 0;
        this.stepsFromFood = undefined;
        //For perf reasons. Would some buffer implementation be nice? We only should need one at time, as long as we are not doing things concurrently.
        this.directionScores = [];
        this.move = (directions, world) => {
            world.moveInTheWorld(this.location, directions);
        };
        this.location = [x, y];
        this.randomizeDirection();
        //Right, forward left
        for (let i = 0; i < 3; i++) {
            this.directionScores.push({ direction: (0, directions_1.directionsForward)(this.currentAngle), score: 0 });
        }
    }
    get isDead() {
        return this.age > (0, antConfig_1.antConfig)().antLifespan;
    }
    respawnAtCell(homeCoord) {
        this.location[0] = homeCoord[0];
        this.location[1] = homeCoord[1];
        this.state = types_1.AntState.SEARCH_FOOD;
        this.randomizeDirection();
        this.age = 0;
        this.stepsFromFood = undefined;
        this.stepsFromHome = 0;
    }
    shouldRespawn() {
        return (Math.random() * 100) < (0, antConfig_1.staticParameters)().RESPAWN_PERCENTAGE;
    }
    randomizeDirection() {
        this.currentAngle = Math.floor(Math.random() * types_1.directions.length);
    }
    turnAround() {
        this.currentAngle = (this.currentAngle + Math.floor(types_1.directions.length / 2)) % types_1.directions.length;
    }
    exploreWorld(world, tick) {
        const directions = [(0, directions_1.directionsForward)(this.currentAngle), (0, directions_1.directionsLeft)(this.currentAngle), (0, directions_1.directionsRight)(this.currentAngle)];
        const scores = this.score(directions, world, tick);
        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score; });
        let chosen = scores[0];
        //If no direction is particularly good, move at random.
        //There's also a 20% chance the ant moves randomly even 
        //if there is an optimal direction,
        //just to give them a little more interesting behavior.
        const random = Math.random();
        if (random <= (0, antConfig_1.antConfig)().moveForwardPercentage && forward.score >= 0) {
            chosen = forward;
        }
        else if (random > (0, antConfig_1.antConfig)().moveForwardPercentage && random < ((0, antConfig_1.antConfig)().moveRandomPercentage + (0, antConfig_1.antConfig)().moveForwardPercentage)) {
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
            with index ${(0, coordinateUtil_1.getIndexWithCoordinate)((0, antConfig_1.staticParameters)().COLUMNS, (0, antConfig_1.staticParameters)().ROWS, this.location[0], this.location[1])}`);
        }
        this.stepsFromHome += 1;
        this.stepsFromFood = this.stepsFromFood === undefined ? undefined : this.stepsFromFood + 1;
        return newLocation;
    }
    simulateAnt(world, currentTick) {
        let action = types_1.AntAction.NO_ACTION;
        if (this.isDead) {
            if (this.shouldRespawn()) {
                this.respawnAtCell(world.getHomeCoord());
            }
            return action;
        }
        let newLocation = this.exploreWorld(world, currentTick);
        if (!!newLocation) {
            if (newLocation.type === types_1.CellStates.HOME) {
                action = this.state === types_1.AntState.CARRY_FOOD ? types_1.AntAction.NESTED_FOOD : types_1.AntAction.NO_ACTION;
                this.foundHome();
            }
            else if (newLocation.type === types_1.CellStates.FOOD) {
                action = this.state === types_1.AntState.SEARCH_FOOD ? types_1.AntAction.FOUND_FOOD : types_1.AntAction.NO_ACTION;
                this.foundFood(newLocation);
            }
            newLocation.addPheremone(this.stepsFromHome, this.stepsFromFood, currentTick);
        }
        else {
            this.age = (0, antConfig_1.antConfig)().antLifespan + 1;
        }
        this.age++;
        return action;
    }
    score(directions, world, tick) {
        const scores = this.directionScores;
        directions.forEach((direction, index) => {
            //We are reusing the old object here for performance reasons. This is not elegant, but hopefully more efficient. 
            let score = scores[index];
            score.direction = direction,
                score.score = (0, scoring_1.getScoreForDirection)(direction, this.location, this.state, world, tick);
        });
        return scores;
    }
    foundHome() {
        if (this.state === types_1.AntState.CARRY_FOOD) {
            this.state = types_1.AntState.SEARCH_FOOD;
            this.turnAround();
            this.stepsFromFood = undefined;
        }
        this.stepsFromHome = 0;
    }
    foundFood(location) {
        if (this.state === types_1.AntState.SEARCH_FOOD) {
            this.state = types_1.AntState.CARRY_FOOD;
            this.turnAround();
            location.reduceFood();
        }
        this.stepsFromFood = 0;
        //When ant finds food, it turns around. Should we make home pheromone undefined here?
    }
}
exports.Ant = Ant;
