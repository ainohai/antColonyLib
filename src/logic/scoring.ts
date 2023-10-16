import { staticParameters, walkerConfig } from "../config/walkerConfig";
import { Walker } from "../entities/Walker";
import { SimulationWorld, Cell } from "../entities/World";
import { Coordinate, DirectionScore } from "../types";
import { wrapCoordinateToWorld } from "../utils/coordinateUtil";
import { directions, toLeft, toRight } from "./directions";

export const scoreDirections = (walker: Walker, world: SimulationWorld, tick: number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number): DirectionScore[] => {

    const nextAngles = [walker.currentAngle, toLeft(walker.currentAngle, 1), 
        toRight(walker.currentAngle, 1)];

   const scores: DirectionScore[] = []

   if (scores.length > nextAngles.length) {
    throw "Should clean the old object!!"
   }

    nextAngles.forEach((angle, index) => { 
        let score: DirectionScore = getScoreForDirection(angle, walker, world, tick, scoreFunction)
        scores.push(score);
    });

    return scores;
}

export const getScoreForDirection = (angle: number, walker: Walker, world: SimulationWorld, currentTick:number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number): DirectionScore => {

    let range = walkerConfig().sight;
    let score = 0;

    const currentLocation = walker.location;

    const origX = currentLocation[0];
    const origY = currentLocation[1];

    const startPointX = origX - range;
    const startPointY = origY - range;

    let bestCell = [origX + directions[angle].x, origY + directions[angle].y]
    let maxValue = 0;

    for (let x = startPointX; x <= origX + range; x++) {
        for (let y = startPointY; y <= origY + range; y++) {

            if (x !== origX && y !== origY) {
            
            let newLocation = wrapCoordinateToWorld(staticParameters().COLUMNS, staticParameters().ROWS, [x, y]);
            
            let c = world.getCell(newLocation[0], newLocation[1]);
            
            if (!!c) {

                c.touchPheromones(currentTick);
                const cellScore = scoreFunction(walker, newLocation, currentTick, world);

                if (cellScore > maxValue) {
                    maxValue = cellScore;
                    bestCell = newLocation;
                }
            
            }
        }
        }
    }
    

    let angleBtwXAxis = Math.atan((bestCell[1] - origY) / (bestCell[0] - origX));
    const INDEX_OF_WEST = 6;

    let closestDirection = Math.floor((angleBtwXAxis- (2*Math.PI / 16)) % 8 )
    let wrappedToDirections =  (closestDirection + INDEX_OF_WEST) % (directions.length -1)

    return { direction: wrappedToDirections, score: maxValue};
}

export const getRandomDirectionScored = (walker: Walker, world: SimulationWorld, currentTick:number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number): DirectionScore => {

    const angles = [walker.currentAngle, toLeft(walker.currentAngle, 1), 
        toRight(walker.currentAngle, 1)];

    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    return getScoreForDirection(randomAngle, walker, world, currentTick, scoreFunction)
};


    /*    const scores =  score(this, world, tick, actions.scoreCell);

        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score});
        
        let chosen: DirectionScore|undefined = scores[0];
       
*/