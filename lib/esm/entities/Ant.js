import { directions, directionsForward, directionsLeft, directionsRight } from "../logic/directions";
import { getScoreForDirection } from "../logic/scoring";
import { antConfig, CellStates, staticParameters } from "../antConfig";
import { getIndexWithCoordinate } from "../utils/coordinateUtil";
export var AntState;
(function (AntState) {
    AntState[AntState["SEARCH_FOOD"] = 0] = "SEARCH_FOOD";
    AntState[AntState["CARRY_FOOD"] = 1] = "CARRY_FOOD";
})(AntState || (AntState = {}));
export class Ant {
    location;
    age = 0;
    currentAngle = 0;
    state = AntState.SEARCH_FOOD;
    stepsFromHome = 0;
    stepsFromFood = undefined;
    //For perf reasons. Would some buffer implementation be nice? We only should need one at time, as long as we are not doing things concurrently.
    directionScores = [];
    constructor(x, y) {
        this.location = [x, y];
        this.randomizeDirection();
        //Right, forward left
        for (let i = 0; i < 3; i++) {
            this.directionScores.push({ direction: directionsForward(this.currentAngle), score: 0 });
        }
    }
    get isDead() {
        return this.age > antConfig.antLifespan;
    }
    respawnAtCell(homeCoord) {
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
    move = (directions, world) => {
        world.moveInTheWorld(this.location, directions);
    };
    exploreWorld(world, tick) {
        const directions = [directionsForward(this.currentAngle), directionsLeft(this.currentAngle), directionsRight(this.currentAngle)];
        const scores = this.score(directions, world, tick);
        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score; });
        let chosen = scores[0];
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
    simulateAnt(world, currentTick) {
        if (this.isDead) {
            if (this.shouldRespawn()) {
                this.respawnAtCell(world.getHomeCoord());
            }
            return;
        }
        let newLocation = this.exploreWorld(world, currentTick);
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
    score(directions, world, tick) {
        const scores = this.directionScores;
        directions.forEach((direction, index) => {
            //We are reusing the old object here for performance reasons. This is not elegant, but hopefully more efficient. 
            let score = scores[index];
            score.direction = direction,
                score.score = getScoreForDirection(direction, this.location, this.state, world, tick);
        });
        return scores;
    }
    foundHome() {
        if (this.state === AntState.CARRY_FOOD) {
            this.state = AntState.SEARCH_FOOD;
            this.turnAround();
        }
        this.stepsFromHome = 0;
    }
    foundFood(location) {
        if (this.state === AntState.SEARCH_FOOD) {
            this.state = AntState.CARRY_FOOD;
            this.turnAround();
            location.reduceFood();
        }
        this.stepsFromFood = 0;
    }
}
