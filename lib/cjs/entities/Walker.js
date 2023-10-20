"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Walker = void 0;
const walkerConfig_1 = require("../config/walkerConfig");
const coordinateUtil_1 = require("../utils/coordinateUtil");
const types_1 = require("../types");
const Agent_1 = require("./Agent");
class Walker extends Agent_1.Agent {
    constructor(x, y, walkerState, initialPheremone) {
        super([x, y]);
        this.ageLeft = 0;
        this.currentAngle = 0;
        this.move = (directions, world) => {
            world.moveInTheWorld(this.location, directions);
        };
        this.ageLeft = (0, walkerConfig_1.walkerConfig)().walkerLifespan;
        this.initialState = walkerState;
        this.state = Object.assign({}, this.initialState);
        this.pheremone = !!initialPheremone ? Object.assign({}, initialPheremone) : undefined;
        this.initialPheremone = initialPheremone;
    }
    get isDead() {
        return this.ageLeft <= 0;
    }
    respawnAtCell(homeCoord) {
        this.location[0] = homeCoord[0];
        this.location[1] = homeCoord[1];
        this.state = this.initialState;
        this.pheremone = !!this.initialPheremone ? Object.assign({}, this.initialPheremone) : undefined;
        this.randomizeDirection();
        this.ageLeft = (0, walkerConfig_1.walkerConfig)().walkerLifespan;
    }
    shouldRespawn() {
        return (Math.random() * 100) < (0, walkerConfig_1.staticParameters)().RESPAWN_PERCENTAGE;
    }
    randomizeDirection() {
        this.currentAngle = Math.floor(Math.random() * types_1.directions.length);
    }
    turnAround() {
        this.currentAngle = (this.currentAngle + Math.floor(types_1.directions.length / 2)) % types_1.directions.length;
    }
    exploreWorld(world, tick) {
        var _a;
        const chosen = this.pickNextDirection(world, tick);
        //Move the walker. 
        if (!!chosen && chosen.score >= 0) {
            this.move(types_1.directions[chosen.direction], world);
            this.currentAngle = chosen.direction;
            this.state.lastChoice = (_a = chosen.choiceType) !== null && _a !== void 0 ? _a : types_1.ChoiceType.UNKNOWN;
        }
        else {
            //Randomize direction and try again next round
            this.randomizeDirection();
            this.state.lastChoice = types_1.ChoiceType.UNKNOWN;
            console.log("Randomized");
        }
        const newLocation = [this.location[0], this.location[1]];
        if (!newLocation) {
            throw new Error(`No cell found for walker in (${this.location[0]}, ${this.location[1]}) 
            with index ${(0, coordinateUtil_1.getIndexWithCoordinate)((0, walkerConfig_1.staticParameters)().COLUMNS, (0, walkerConfig_1.staticParameters)().ROWS, this.location[0], this.location[1])}`);
        }
        return newLocation;
    }
    simulate(world, currentTick) {
        let action = types_1.walkerAction.NO_ACTION;
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
exports.Walker = Walker;
