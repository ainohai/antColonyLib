import { antConfig } from "../config/antConfig";
import { AntState, CellStates } from "../types";
import { directions } from "./directions";
export const getScoreForDirection = (directionIndex, currentLocation, state, world, currentTick) => {
    let range = antConfig().sight;
    let score = 0;
    const origX = currentLocation[0];
    const origY = currentLocation[1];
    const direction = directions[directionIndex];
    for (let i = 1; i <= range; i++) {
        let newLocationX = origX + i * direction.x;
        let newLocationY = origY + i * direction.y;
        let c = world.getCell(newLocationX, newLocationY);
        if (!!c) {
            var cellScore = scoreForCell(c, state, currentTick);
            let distanceOptimizedScore = cellScore * (antConfig().sight / (Math.sqrt(Math.pow(i, 2) + Math.pow(i, 2)) * (range + 1)));
            score = score + cellScore;
        }
    }
    return score;
};
const scoreForCell = (c, antState, currentTick) => {
    c.touchPheromones(currentTick);
    //searching food
    if (antState === AntState.SEARCH_FOOD) {
        if (c.type === CellStates.FOOD) {
            //If it's food, we don't care about pheremones
            return Number.MAX_VALUE;
        }
        else {
            return c.foodPheremone;
        }
        //Going home
    }
    else {
        if (c.type === CellStates.HOME) {
            //console.log("seeing home")
            return Number.MAX_VALUE;
        }
        else {
            return c.homePheremone;
        }
    }
};
