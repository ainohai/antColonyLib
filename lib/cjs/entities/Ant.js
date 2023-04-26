"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ant = void 0;
const antConfig_1 = require("../config/antConfig");
const coordinateUtil_1 = require("../utils/coordinateUtil");
const types_1 = require("../types");
const AntState_1 = require("./AntState");
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
const initialState = {
    lockedInStateUntilTick: undefined,
    startedInStateOnTick: 0,
    hasFood: false,
    mode: types_1.AntDecisionModeType.SEARCHING_FOOD,
    lastChoice: types_1.ChoiceType.UNKNOWN
};
const initialPheremone = {
    type: types_1.PheremoneType.HOME,
    pickedUpPheremoneOnTick: 0
};
class Ant {
    constructor(x, y, id) {
        this.ageLeft = 0;
        this.currentAngle = 0;
        this.move = (directions, world) => {
            world.moveInTheWorld(this.location, directions);
        };
        this.location = [x, y];
        this.randomizeDirection();
        this.ageLeft = (0, antConfig_1.antConfig)().antLifespan;
        this.state = Object.assign({}, initialState);
        this.pheremone = Object.assign({}, initialPheremone);
        this.id = id;
    }
    get isDead() {
        return this.ageLeft <= 0;
    }
    respawnAtCell(homeCoord) {
        this.location[0] = homeCoord[0];
        this.location[1] = homeCoord[1];
        this.state = initialState;
        this.pheremone = initialPheremone;
        this.randomizeDirection();
        this.ageLeft = (0, antConfig_1.antConfig)().antLifespan;
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
        var _a;
        const actions = (0, AntState_1.modeActions)(this.state.mode);
        const chosen = actions.chosen(this, world, tick);
        //Move the ant. 
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
        const newLocation = world.getCell(this.location[0], this.location[1]);
        if (!newLocation) {
            throw new Error(`No cell found for ant in (${this.location[0]}, ${this.location[1]}) 
            with index ${(0, coordinateUtil_1.getIndexWithCoordinate)((0, antConfig_1.staticParameters)().COLUMNS, (0, antConfig_1.staticParameters)().ROWS, this.location[0], this.location[1])}`);
        }
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
        action = this.moveActions(newLocation, action, currentTick);
        this.ageLeft = this.ageLeft - 1;
        if (this.state.lockedInStateUntilTick === currentTick) {
            this.state.mode = this.state.hasFood ? types_1.AntDecisionModeType.SEARHCING_HOME : types_1.AntDecisionModeType.SEARCHING_FOOD;
            this.state.lockedInStateUntilTick = undefined;
            this.state.startedInStateOnTick = currentTick;
        }
        return action;
    }
    moveActions(newLocation, action, currentTick) {
        var _a, _b, _c, _d;
        if (!!newLocation) {
            if (newLocation.type === types_1.CellStates.HOME) {
                action = this.foundHome(currentTick);
            }
            else if (newLocation.type === types_1.CellStates.FOOD) {
                action = this.foundFood(newLocation, currentTick);
            }
            if (!!((_a = this.pheremone) === null || _a === void 0 ? void 0 : _a.type) !== undefined && ((_b = this.pheremone) === null || _b === void 0 ? void 0 : _b.pickedUpPheremoneOnTick) !== undefined) {
                newLocation.addPheremone((_c = this.pheremone) === null || _c === void 0 ? void 0 : _c.type, (_d = this.pheremone) === null || _d === void 0 ? void 0 : _d.pickedUpPheremoneOnTick, currentTick);
            }
        }
        const random = Math.random();
        if ((0, antConfig_1.antConfig)().antAnarchyRandomPercentage && random <= (0, antConfig_1.antConfig)().antAnarchyRandomPercentage) {
            console.log("anarcgy: " + (0, antConfig_1.antConfig)().antAnarchyRandomPercentage);
            this.randomizeDirection();
            this.state.lockedInStateUntilTick = currentTick + 10;
            this.state.startedInStateOnTick = currentTick;
            this.state.mode = types_1.AntDecisionModeType.ANARCHY;
        }
        return action;
    }
    foundHome(tick) {
        let action = types_1.AntAction.NO_ACTION;
        if (this.state.mode === types_1.AntDecisionModeType.SEARHCING_HOME) {
            action = types_1.AntAction.NESTED_FOOD;
            this.state.mode = types_1.AntDecisionModeType.SEARCHING_FOOD;
            this.state.hasFood = false;
            this.turnAround();
            this.state.startedInStateOnTick = tick;
            this.pheremone = { pickedUpPheremoneOnTick: tick, type: types_1.PheremoneType.HOME };
        }
        //Should we count steps from home, if ant is looking for home??
        return action;
    }
    foundFood(location, tick) {
        let action = types_1.AntAction.NO_ACTION;
        if (this.state.mode === types_1.AntDecisionModeType.SEARCHING_FOOD) {
            this.state.mode = types_1.AntDecisionModeType.SEARHCING_HOME;
            this.state.hasFood = true;
            this.turnAround();
            location.reduceFood();
            this.state.startedInStateOnTick = tick;
            action = types_1.AntAction.FOUND_FOOD;
            this.pheremone = { pickedUpPheremoneOnTick: tick, type: types_1.PheremoneType.SUGAR };
        }
        return action;
    }
}
exports.Ant = Ant;
