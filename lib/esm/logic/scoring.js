import { walkerConfig } from "../config/walkerConfig";
import { directions, toLeft, toRight } from "./directions";
export const scoreDirections = (walker, world, tick, scoreFunction) => {
    const nextAngles = [walker.currentAngle, toLeft(walker.currentAngle, 1),
        toRight(walker.currentAngle, 1)];
    const scores = [];
    if (scores.length > nextAngles.length) {
        throw "Should clean the old object!!";
    }
    nextAngles.forEach((angle, index) => {
        let score = getScoreForDirection(angle, walker, world, tick, scoreFunction);
        scores.push(score);
    });
    return scores;
};
export const getScoreForDirection = (angle, walker, world, currentTick, scoreFunction) => {
    let range = walkerConfig().sight;
    let score = 0;
    const currentLocation = walker.location;
    const origX = currentLocation[0];
    const origY = currentLocation[1];
    const direction = directions[angle];
    for (let i = 1; i <= range; i++) {
        let newLocationX = origX + i * direction.x;
        let newLocationY = origY + i * direction.y;
        let c = world.getCell(newLocationX, newLocationY);
        if (!!c) {
            c.touchPheromones(currentTick);
            const cellScore = scoreFunction(walker, [newLocationX, newLocationY], currentTick, world);
            let distanceOptimizedScore = cellScore *
                (walkerConfig().sight / (Math.sqrt(Math.pow(i, 2) + Math.pow(i, 2)) * (range + 1)));
            score = Math.max(score, cellScore);
        }
    }
    return { direction: angle, score: score };
};
export const getRandomDirectionScored = (walker, world, currentTick, scoreFunction) => {
    const angles = [walker.currentAngle, toLeft(walker.currentAngle, 1),
        toRight(walker.currentAngle, 1)];
    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    return getScoreForDirection(randomAngle, walker, world, currentTick, scoreFunction);
};
/*    const scores =  score(this, world, tick, actions.scoreCell);

    const forward = scores[0];
    scores.sort((o1, o2) => { return o2.score - o1.score});
    
    let chosen: DirectionScore|undefined = scores[0];
   
*/ 
