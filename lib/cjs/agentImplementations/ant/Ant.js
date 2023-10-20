"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ant = void 0;
const walkerConfig_1 = require("../../config/walkerConfig");
const types_1 = require("../../types");
const Walker_1 = require("../../entities/Walker");
const AntState_1 = require("./AntState");
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
class Ant extends Walker_1.Walker {
    constructor(x, y, id) {
        super(x, y, initialState, initialPheremone);
        this.randomizeDirection();
        this.id = id;
    }
    deleteMe() {
        return false;
    }
    moveActions(newLocation, action, currentTick, world) {
        var _a, _b, _c, _d;
        if (!!newLocation) {
            if (world.getTypeFromCell(types_1.AgentType.HOME, newLocation).length > 0) {
                action = this.foundHome(currentTick);
            }
            const food = world.getTypeFromCell(types_1.AgentType.FOOD, newLocation);
            if (food.length > 0) {
                action = this.foundFood(food[0], currentTick);
            }
            if (!!((_a = this.pheremone) === null || _a === void 0 ? void 0 : _a.type) !== undefined && ((_b = this.pheremone) === null || _b === void 0 ? void 0 : _b.pickedUpPheremoneOnTick) !== undefined) {
                const cell = world.getCell(newLocation[0], newLocation[1]);
                if (!cell) {
                    throw `Illegal cell for pheremones: (${newLocation[0]}, ${newLocation[1]})`;
                }
                cell.addPheremone((_c = this.pheremone) === null || _c === void 0 ? void 0 : _c.type, (_d = this.pheremone) === null || _d === void 0 ? void 0 : _d.pickedUpPheremoneOnTick, currentTick);
            }
        }
        const random = Math.random();
        if ((0, walkerConfig_1.walkerConfig)().walkerAnarchyRandomPercentage && random <= (0, walkerConfig_1.walkerConfig)().walkerAnarchyRandomPercentage) {
            console.log("anarcgy: " + (0, walkerConfig_1.walkerConfig)().walkerAnarchyRandomPercentage);
            this.randomizeDirection();
            this.state.lockedInStateUntilTick = currentTick + 10;
            this.state.startedInStateOnTick = currentTick;
            this.state.mode = types_1.AntDecisionModeType.ANARCHY;
        }
        if (this.state.lockedInStateUntilTick === currentTick) {
            this.state.mode = this.state.hasFood ? types_1.AntDecisionModeType.SEARHCING_HOME : types_1.AntDecisionModeType.SEARCHING_FOOD;
            this.state.lockedInStateUntilTick = undefined;
            this.state.startedInStateOnTick = currentTick;
        }
        return action;
    }
    foundHome(tick) {
        let action = types_1.walkerAction.NO_ACTION;
        if (this.state.mode === types_1.AntDecisionModeType.SEARHCING_HOME) {
            action = types_1.walkerAction.NESTED_FOOD;
            this.state.mode = types_1.AntDecisionModeType.SEARCHING_FOOD;
            this.state.hasFood = false;
            this.turnAround();
            this.state.startedInStateOnTick = tick;
            this.pheremone = { pickedUpPheremoneOnTick: tick, type: types_1.PheremoneType.HOME };
        }
        //Should we count steps from home, if walker is looking for home??
        return action;
    }
    pickNextDirection(world, tick) {
        const actions = (0, AntState_1.modeActions)(this.state.mode);
        const chosen = actions.chosen(this, world, tick);
        return chosen;
    }
    foundFood(food, tick) {
        let action = types_1.walkerAction.NO_ACTION;
        if (this.state.mode === types_1.AntDecisionModeType.SEARCHING_FOOD) {
            this.state.mode = types_1.AntDecisionModeType.SEARHCING_HOME;
            this.state.hasFood = true;
            this.turnAround();
            food.reduceFood();
            this.state.startedInStateOnTick = tick;
            action = types_1.walkerAction.FOUND_FOOD;
            this.pheremone = { pickedUpPheremoneOnTick: tick, type: types_1.PheremoneType.SUGAR };
        }
        return action;
    }
}
exports.Ant = Ant;
