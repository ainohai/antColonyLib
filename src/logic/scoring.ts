import { antConfig } from "../config/antConfig";
import { Ant } from "../entities/Ant";
import { AntWorld, Cell } from "../entities/World";
import { DirectionScore } from "../types";
import { directions, toLeft, toRight } from "./directions";

export const scoreDirections = (ant: Ant, world: AntWorld, tick: number, scoreFunction: (ant: Ant, cell: Cell, tick: number) => number): DirectionScore[] => {

    const nextAngles = [ant.currentAngle, toLeft(ant.currentAngle, 1), 
        toRight(ant.currentAngle, 1)];

   const scores: DirectionScore[] = []

   if (scores.length > nextAngles.length) {
    throw "Should clean the old object!!"
   }

    nextAngles.forEach((angle, index) => { 
        let score: DirectionScore = getScoreForDirection(angle, ant, world, tick, scoreFunction)
        scores.push(score);
    });

    return scores;
}

export const getScoreForDirection = (angle: number, ant: Ant, world: AntWorld, currentTick:number, scoreFunction: (ant: Ant, cell: Cell, tick: number) => number): DirectionScore => {

    let range = antConfig().sight;
    let score = 0;

    const currentLocation = ant.location;

    const origX = currentLocation[0];
    const origY = currentLocation[1];

    const direction = directions[angle];

    for (let i = 1; i <= range; i++) {

        let newLocationX = origX + i * direction.x;
        let newLocationY = origY + i * direction.y;

            let c = world.getCell(newLocationX, newLocationY);
            
            if (!!c) {

                c.touchPheromones(currentTick);
                const cellScore = scoreFunction(ant, c, currentTick);

                let distanceOptimizedScore = cellScore * 
                    (antConfig().sight / (Math.sqrt(Math.pow(i, 2) + Math.pow(i, 2)) * (range + 1)));
                score = Math.max(score, cellScore);

    }
    }
    return { direction: angle, score: score};
}

export const getRandomDirectionScored = (ant: Ant, world: AntWorld, currentTick:number, scoreFunction: (ant: Ant, cell: Cell, tick: number) => number): DirectionScore => {

    const angles = [ant.currentAngle, toLeft(ant.currentAngle, 1), 
        toRight(ant.currentAngle, 1)];

    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    return getScoreForDirection(randomAngle, ant, world, currentTick, scoreFunction)
};


    /*    const scores =  score(this, world, tick, actions.scoreCell);

        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score});
        
        let chosen: DirectionScore|undefined = scores[0];
       
*/