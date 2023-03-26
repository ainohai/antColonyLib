"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ant = exports.AntState = void 0;
const directions_1 = require("../logic/directions");
const scoring_1 = require("../logic/scoring");
const antConfig_1 = require("../antConfig");
const coordinateUtil_1 = require("../utils/coordinateUtil");
var AntState;
(function (AntState) {
    AntState[AntState["SEARCH_FOOD"] = 0] = "SEARCH_FOOD";
    AntState[AntState["CARRY_FOOD"] = 1] = "CARRY_FOOD";
})(AntState = exports.AntState || (exports.AntState = {}));
class Ant {
    constructor(x, y) {
        this.age = 0;
        this.currentAngle = 0;
        this.state = AntState.SEARCH_FOOD;
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
        return this.age > antConfig_1.antConfig.antLifespan;
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
        return (Math.random() * 100) < antConfig_1.staticParameters.RESPAWN_PERCENTAGE;
    }
    randomizeDirection() {
        this.currentAngle = Math.floor(Math.random() * directions_1.directions.length);
    }
    turnAround() {
        this.currentAngle = (this.currentAngle + Math.floor(directions_1.directions.length / 2)) % directions_1.directions.length;
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
        if (random <= antConfig_1.antConfig.moveForwardPercentage && forward.score >= 0) {
            chosen = forward;
        }
        else if (random > antConfig_1.antConfig.moveForwardPercentage && random < (antConfig_1.antConfig.moveRandomPercentage + antConfig_1.antConfig.moveForwardPercentage)) {
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
            with index ${(0, coordinateUtil_1.getIndexWithCoordinate)(antConfig_1.staticParameters.COLUMNS, antConfig_1.staticParameters.ROWS, this.location[0], this.location[1])}`);
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
            if (newLocation.type === antConfig_1.CellStates.HOME) {
                this.foundHome();
            }
            else if (newLocation.type === antConfig_1.CellStates.FOOD) {
                this.foundFood(newLocation);
            }
            newLocation.addPheremone(this.stepsFromHome, this.stepsFromFood, currentTick);
        }
        else {
            this.age = antConfig_1.antConfig.antLifespan + 1;
        }
        this.age++;
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
exports.Ant = Ant;
