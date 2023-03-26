"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScoreForDirection = void 0;
const Ant_1 = require("../entities/Ant");
const antConfig_1 = require("../antConfig");
const getScoreForDirection = (direction, currentLocation, state, world, currentTick) => {
    let range = antConfig_1.antConfig.sight;
    let score = 0;
    const origX = currentLocation[0];
    const origY = currentLocation[1];
    for (let i = 1; i <= range; i++) {
        let newLocationX = origX + i * direction.x;
        let newLocationY = origY + i * direction.y;
        let c = world.getCell(newLocationX, newLocationY);
        if (!!c) {
            var cellScore = scoreForCell(c, state, currentTick);
            let distanceOptimizedScore = cellScore * (1 / (Math.sqrt(Math.pow(i, 2) + Math.pow(i, 2)) * (range + 1)));
            score = score + distanceOptimizedScore;
        }
    }
    return score;
};
exports.getScoreForDirection = getScoreForDirection;
const scoreForCell = (c, antState, currentTick) => {
    c.touchPheromones(currentTick);
    //searching food
    if (antState === Ant_1.AntState.SEARCH_FOOD) {
        if (c.type === antConfig_1.CellStates.FOOD) {
            return Number.MAX_VALUE;
        }
        else {
            return c.foodPheremone;
        }
        //Going home
    }
    else {
        if (c.type === antConfig_1.CellStates.HOME) {
            console.log("seeing home");
            return Number.MAX_VALUE;
        }
        else {
            return c.homePheremone;
        }
    }
};
