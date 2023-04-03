import { antConfig } from "../config/antConfig";
import { AntWorld, Cell } from "../entities/World";
import { AntState, CellStates, Coordinate, Direction } from "../types";
import { wrapCoordinateToWorld } from "../utils/coordinateUtil";

export const getScoreForDirection = (direction: Direction, currentLocation: Coordinate, state: AntState, world: AntWorld, currentTick:number): number => {

    let range = antConfig().sight;
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
}

const scoreForCell = (c: Cell, antState: AntState, currentTick: number): number => {

    c.touchPheromones(currentTick);

    //searching food
    if (antState === AntState.SEARCH_FOOD) {
        if (c.type === CellStates.FOOD) {
            return Number.MAX_VALUE
        } else {
            return c.foodPheremone;
        }
    //Going home
    } else {
        if (c.type === CellStates.HOME) {
            console.log("seeing home")
            return Number.MAX_VALUE;
        } else {
            return c.homePheremone;
        }
    }

}
