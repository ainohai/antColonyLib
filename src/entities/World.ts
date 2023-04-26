import { getCoordinateWithIndex, getIndexWithCoordinate, getValueWithCoordinate, wrapCoordinateToWorld } from '../utils/coordinateUtil';
import { antConfig, staticParameters } from "../config/antConfig";
import { CellStates, Coordinate, Direction, Pheremone, PheremoneType, SimulationStatistics } from '../types';

const MAX_CELL_PHEREMONE = 1;

export class Cell {
    type: CellStates = CellStates.EMPTY;
    //foodPheremone: number = 0;
    //homePheremone: number = 0;
    foodCount: number = 0;
    //simulation cycle when pheromones were last calculated. 
    touched: number = 0;
    homePheremone: number = 0;
    foodPheremone: number = 0;

    constructor() {
    }

    reduceFood() {
        this.foodCount -= 1;

        if (this.foodCount === 0) {
            this.type = CellStates.EMPTY;
        }
    }

    touchPheromones(currentTick: number) {
        if (this.touched === currentTick) {
            return;
        }

        //Doesn't worry about concurrency. 
        const evaporationTime = currentTick - this.touched;

        const food = this.foodPheremone * (1 - antConfig().foodPheremoneDecay * evaporationTime);
        const home = this.homePheremone * (1 -  antConfig().homePheremoneDecay * evaporationTime);

        this.foodPheremone = food > 0 ? food : 0;
        this.homePheremone = home > 0 ? home : 0

        this.touched = currentTick;

    }
    boundPheremone(min: number, max: number, current: number, addition: number) {
        const pheremone = current + addition;
        if (pheremone > max) {
            return max;
        }
        else if (pheremone < min) {
            return min;
        }
        return pheremone;
    }

    addPheremone(pheremoneType: PheremoneType, startingStep: number, currentTick: number) {
        this.touchPheromones(currentTick);

        if (pheremoneType === PheremoneType.SUGAR){ 
            let foodPheremoneAdd = antConfig().antFoodPheremoneWeight * (1 - (antConfig().antFoodPheremoneDecay * (currentTick - startingStep)));
            foodPheremoneAdd = foodPheremoneAdd > 0 ? foodPheremoneAdd : 0;
            
            this.foodPheremone = this.boundPheremone(0, antConfig().maxPheremone, this.foodPheremone, foodPheremoneAdd);
        }
        if (pheremoneType === PheremoneType.HOME){
            let homePheremoneAdd = antConfig().antHomePheremoneWeight * (1 - (antConfig().antHomePheremoneDecay * (currentTick-startingStep)))
            homePheremoneAdd = homePheremoneAdd > 0 ? homePheremoneAdd : 0;
            this.homePheremone = this.boundPheremone(0, antConfig().maxPheremone, this.homePheremone, homePheremoneAdd);
        }


    }
}

export class AntWorld {

    cells: Cell[] = [];
    home: number = 0;
    private foods: number[] = [];

    constructor(columns: number, rows :number) {
        this.cells = [];

        this.createCells(columns, rows);
        this.setHome(Math.floor(columns/2), Math.floor(rows/2));
    }

    getCell(x: number, y: number): (Cell | undefined) {  
        let coordinate = wrapCoordinateToWorld(staticParameters().COLUMNS, staticParameters().ROWS, [x, y]) 
        return getValueWithCoordinate(this.cells, staticParameters().COLUMNS, coordinate[0], coordinate[1]);
    }

    getHome() {
        return this.cells[this.home];
    }


    getFoodCoordinates(): [number, number][] {
        const foods :[number, number][] = [];

        this.foods = this.foods.filter(index => {
            const coordinate = getCoordinateWithIndex(staticParameters().COLUMNS, index);
            const cell = this.getCell(coordinate[0], coordinate[1]);
            return cell?.type === CellStates.FOOD || false;
        });

        for (let food of this.foods) {
            foods.push(getCoordinateWithIndex(staticParameters().COLUMNS, food));
        }

        if (this.foods.length < 12) {
            this.setFood(Math.floor(Math.random() * staticParameters().COLUMNS), Math.floor(Math.random() * 
            staticParameters().ROWS), Math.floor(Math.random() *1000));
        }

        return foods;
    }

    getHomeCoord() {
        return getCoordinateWithIndex(staticParameters().COLUMNS, this.home);
    }

    private createCells(columns: number, rows: number) {
        const totalNumOfCells = columns * rows;

        for (let i = 0; i < totalNumOfCells; i++) {
            const cell = new Cell();
            this.cells.push(cell);
        }
    }

    //Changes the original value.
    moveInTheWorld(location: Coordinate, directions: Direction) {
        const totalColumn = staticParameters().COLUMNS;
        const totalRows = staticParameters().ROWS;
        wrapCoordinateToWorld(totalColumn, totalRows, location);

        location[0] = location[0] + directions.x;
        location[1] = location[1] + directions.y;    
        
        return location;
    }

    private setHome(x: number, y: number) {
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);

        if (!cell) {
            throw new Error(`Trying to set home to illegal point (${x},${y})`)
        }

        cell.type = CellStates.HOME;
        let homeIndex = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        this.home = homeIndex;

    }

    public setFood(x: number, y: number, amount: number) {
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);
        const index = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        
        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`)
        }

        cell.type = CellStates.FOOD;
        cell.foodCount = amount; 
        this.foods.push(index);
    }
}