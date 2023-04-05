import { getCoordinateWithIndex, getIndexWithCoordinate, getValueWithCoordinate, wrapCoordinateToWorld } from '../utils/coordinateUtil';
import { antConfig, staticParameters } from "../config/antConfig";
import { CellStates } from '../types';
export class Cell {
    type = CellStates.EMPTY;
    foodPheremone = 0;
    homePheremone = 0;
    foodCount = 0;
    //simulation cycle when pheromones were last calculated. 
    touched = 0;
    constructor() {
    }
    reduceFood() {
        this.foodCount -= 1;
        if (this.foodCount === 0) {
            this.type = CellStates.EMPTY;
        }
    }
    touchPheromones(currentTick) {
        if (this.touched === currentTick) {
            return;
        }
        //Doesn't have to worry about concurrency. 
        this.touched = currentTick;
        const evaporationTime = currentTick - this.touched;
        this.foodPheremone = this.foodPheremone - (this.foodPheremone * antConfig().foodPheremoneDecay * evaporationTime);
        this.homePheremone = this.homePheremone - (this.homePheremone * antConfig().homePheremoneDecay * evaporationTime);
    }
    addPheremone(stepsFromHome, stepsFromFood, currentTick) {
        this.touchPheromones(currentTick);
        if (!!stepsFromFood) {
            this.foodPheremone = this.foodPheremone + (antConfig().foodDistanceFactor / stepsFromFood);
        }
        this.homePheremone = this.homePheremone + (antConfig().homeDistanceFactor / stepsFromHome);
    }
}
export class AntWorld {
    cells = [];
    home = 0;
    foods = [];
    constructor(columns, rows) {
        this.cells = [];
        this.createCells(columns, rows);
        this.setHome(Math.floor(columns / 2), Math.floor(rows / 2));
    }
    getCell(x, y) {
        let coordinate = wrapCoordinateToWorld(staticParameters().COLUMNS, staticParameters().ROWS, [x, y]);
        return getValueWithCoordinate(this.cells, staticParameters().COLUMNS, coordinate[0], coordinate[1]);
    }
    getHome() {
        return this.cells[this.home];
    }
    getFoodCoordinates() {
        const foods = [];
        for (let food of this.foods) {
            foods.push(getCoordinateWithIndex(staticParameters().COLUMNS, food));
        }
        return foods;
    }
    getHomeCoord() {
        return getCoordinateWithIndex(staticParameters().COLUMNS, this.home);
    }
    createCells(columns, rows) {
        const totalNumOfCells = columns * rows;
        for (let i = 0; i < totalNumOfCells; i++) {
            const cell = new Cell();
            this.cells.push(cell);
        }
    }
    //Changes the original value.
    moveInTheWorld(location, directions) {
        const totalColumn = staticParameters().COLUMNS;
        const totalRows = staticParameters().ROWS;
        wrapCoordinateToWorld(totalColumn, totalRows, location);
        location[0] = location[0] + directions.x;
        location[1] = location[1] + directions.y;
        return location;
    }
    setHome(x, y) {
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);
        if (!cell) {
            throw new Error(`Trying to set home to illegal point (${x},${y})`);
        }
        cell.type = CellStates.HOME;
        let homeIndex = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        this.home = homeIndex;
    }
    setFood(x, y, amount) {
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);
        const index = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`);
        }
        cell.type = CellStates.FOOD;
        cell.foodCount = amount;
        this.foods.push(index);
    }
}
