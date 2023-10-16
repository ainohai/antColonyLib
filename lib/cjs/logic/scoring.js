"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomDirectionScored = exports.getScoreForDirection = exports.scoreDirections = void 0;
const walkerConfig_1 = require("../config/walkerConfig");
const directions_1 = require("./directions");
const scoreDirections = (walker, world, tick, scoreFunction) => {
    const nextAngles = [walker.currentAngle, (0, directions_1.toLeft)(walker.currentAngle, 1),
        (0, directions_1.toRight)(walker.currentAngle, 1)];
    const scores = [];
    if (scores.length > nextAngles.length) {
        throw "Should clean the old object!!";
    }
    nextAngles.forEach((angle, index) => {
        let score = (0, exports.getScoreForDirection)(angle, walker, world, tick, scoreFunction);
        scores.push(score);
    });
    return scores;
};
exports.scoreDirections = scoreDirections;
const getScoreForDirection = (angle, walker, world, currentTick, scoreFunction) => {
    let range = (0, walkerConfig_1.walkerConfig)().sight;
    let score = 0;
    const currentLocation = walker.location;
    const origX = currentLocation[0];
    const origY = currentLocation[1];
    const direction = directions_1.directions[angle];
    for (let i = 1; i <= range; i++) {
        let newLocationX = origX + i * direction.x;
        let newLocationY = origY + i * direction.y;
        let c = world.getCell(newLocationX, newLocationY);
        if (!!c) {
            c.touchPheromones(currentTick);
            const cellScore = scoreFunction(walker, [newLocationX, newLocationY], currentTick, world);
            let distanceOptimizedScore = cellScore *
                ((0, walkerConfig_1.walkerConfig)().sight / (Math.sqrt(Math.pow(i, 2) + Math.pow(i, 2)) * (range + 1)));
            score = Math.max(score, cellScore);
        }
    }
    return { direction: angle, score: score };
};
exports.getScoreForDirection = getScoreForDirection;
const getRandomDirectionScored = (walker, world, currentTick, scoreFunction) => {
    const angles = [walker.currentAngle, (0, directions_1.toLeft)(walker.currentAngle, 1),
        (0, directions_1.toRight)(walker.currentAngle, 1)];
    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    return (0, exports.getScoreForDirection)(randomAngle, walker, world, currentTick, scoreFunction);
};
exports.getRandomDirectionScored = getRandomDirectionScored;
/*    const scores =  score(this, world, tick, actions.scoreCell);

    const forward = scores[0];
    scores.sort((o1, o2) => { return o2.score - o1.score});
    
    let chosen: DirectionScore|undefined = scores[0];
   
*/ 
