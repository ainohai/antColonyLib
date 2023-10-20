import { staticParameters, walkerConfig } from "../config/walkerConfig";
import { Walker } from "../entities/Walker";
import { SimulationWorld, Cell } from "../entities/World";
import { Coordinate, DirectionScore } from "../types";
import { getIndexWithCoordinate, wrapCoordinateToWorld } from "../utils/coordinateUtil";
import { directions, toLeft, toRight } from "./directions";

export const scoreBestDirection = (walker: Walker, world: SimulationWorld, currentTick: number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number): DirectionScore => {

    const range = walkerConfig().sight;
    const currentLocation = walker.location;
    const origX = currentLocation[0];
    const origY = currentLocation[1];

    // Initialize an array to store the sum of scores for each direction
    const directionScores = new Array(8).fill(0);

    for (let x = origX - range; x <= origX + range; x++) {
        for (let y = origY - range; y <= origY + range; y++) {
            // Check if (x, y) is not the same as the walker's current location
            if (x !== origX || y !== origY) {
                const newLocation = wrapCoordinateToWorld(staticParameters().COLUMNS, staticParameters().ROWS, [x, y]);
                const cell = world.getCell(newLocation[0], newLocation[1]);

                if (cell) {
                    cell.touchPheromones(currentTick);
                    const cellScore = scoreFunction(walker, newLocation, currentTick, world);

                    // Calculate the direction index for this cell
                    let angleBtwXAxis = Math.atan2(y - origY, x - origX);
                    if (angleBtwXAxis < 0) {
                        angleBtwXAxis += 2 * Math.PI;
                    }
                    const fraction = angleBtwXAxis / ((2 * Math.PI) / 8);
                    const directionIndex = (Math.floor(fraction) + 2)%8;

                    // Update the sum of scores for the corresponding direction
                    directionScores[directionIndex] += cellScore;
                }
            }
        }
    }

    // Find the direction with the maximum sum score
    let maxDirectionIndex = 0;
    for (let i = 1; i < 8; i++) {
        if (directionScores[i] > directionScores[maxDirectionIndex]) {
            maxDirectionIndex = i;
        }
    }
    /*
        let maxDirectionIndex = 0;
    const currentDirectionIndex = walker.currentAngle;
    let maxDirectionScore = directionScores[currentDirectionIndex];
    for (let i = currentDirectionIndex - 3; i <= currentDirectionIndex + 3; i++) {
        const wrappedDirectionIndex = (i + 8) % 8;
        if (directionScores[wrappedDirectionIndex] > maxDirectionScore) {
            maxDirectionScore = directionScores[wrappedDirectionIndex];
            maxDirectionIndex = wrappedDirectionIndex;
        }
    }*/

    if (directionScores[maxDirectionIndex] === 0) {
        maxDirectionIndex = walker.currentAngle;
        return { direction: maxDirectionIndex, score: directionScores[maxDirectionIndex] };
    }
    
    const loc = world.moveInTheWorld([origX, origY], directions[maxDirectionIndex])
    if (walker.history.filter(h => h[0] === loc[0] && h[1] === loc[1]).length > 0) {
        maxDirectionIndex = walker.currentAngle;
    }

    return { direction: maxDirectionIndex, score: directionScores[maxDirectionIndex] };
}
/*    let angle = walker.currentAngle;
    let range = walkerConfig().sight;


    const currentLocation = walker.location;

    const origX = currentLocation[0];
    const origY = currentLocation[1];

    const startPointX = origX - range;
    const startPointY = origY - range;

    let bestCell = [origX + directions[angle].x, origY + directions[angle].y]
    let maxValue = 0;
    let angleBtwXAxis = Math.atan2((bestCell[1] - origY), (bestCell[0] - origX));
    if (angleBtwXAxis < 0) {
        angleBtwXAxis += 2 * Math.PI;
    }
    
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
                    angleBtwXAxis = Math.atan2((y - origY), (x - origX));
                    if (angleBtwXAxis < 0) {
                        angleBtwXAxis += 2 * Math.PI;
                    }

                
                }            
            }
        }
        }
    }


    const INDEX_OF_EAST = 2;
    const sectorAngle = (2 * Math.PI) / 8;

    // Calculate which sector the angle belongs to
     const fraction = angleBtwXAxis / sectorAngle;

     const sector = Math.floor(fraction);

    let wrappedToDirections =  (sector + 2) % 8;

    console.log(maxValue);

    return { direction: wrappedToDirections, score: maxValue};*/
//}

export const getRandomDirectionScored = (walker: Walker, world: SimulationWorld, currentTick:number, scoreFunction: (walker: Walker, coordinate: Coordinate, tick: number, world: SimulationWorld) => number): DirectionScore => {

    const angles = [walker.currentAngle, toLeft(walker.currentAngle, 1), 
        toRight(walker.currentAngle, 1)];

    const randomAngle = angles[Math.floor(Math.random() * angles.length)];
    return{ direction: randomAngle, score: 0};
};


    /*    const scores =  score(this, world, tick, actions.scoreCell);

        const forward = scores[0];
        scores.sort((o1, o2) => { return o2.score - o1.score});
        
        let chosen: DirectionScore|undefined = scores[0];
       
*/