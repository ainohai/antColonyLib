import { getCoordinateWithIndex, getIndexWithCoordinate, getValueWithCoordinate, wrapCoordinateToWorld } from '../utils/coordinateUtil';
import { antConfig, staticParameters } from "../config/antConfig";
import { CellStates } from '../types';
const MAX_CELL_PHEREMONE = 1;
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
        //Doesn't worry about concurrency. 
        const evaporationTime = currentTick - this.touched;
        const food = this.foodPheremone * (1 - antConfig().foodPheremoneDecay * evaporationTime);
        const home = this.homePheremone * (1 - antConfig().homePheremoneDecay * evaporationTime);
        this.foodPheremone = food > 0 ? food : 0;
        this.homePheremone = home > 0 ? home : 0;
        this.touched = currentTick;
    }
    addPheremone(stepsFromHome, stepsFromFood, currentTick) {
        this.touchPheromones(currentTick);
        if (!!stepsFromFood) {
            const foodPheremoneAdd = antConfig().antPheremoneWeight * (1 - (antConfig().antFoodPheremoneDecay * (stepsFromFood)));
            this.foodPheremone = this.foodPheremone + (foodPheremoneAdd > 0 ? foodPheremoneAdd : 0);
        }
        if (!!stepsFromHome) {
            const homePheremoneAdd = antConfig().antPheremoneWeight * (1 - (antConfig().antHomePheremoneDecay * stepsFromHome));
            this.homePheremone = this.homePheremone + (homePheremoneAdd > 0 ? homePheremoneAdd : 0);
        }
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
        this.foods = this.foods.filter(index => {
            const coordinate = getCoordinateWithIndex(staticParameters().COLUMNS, index);
            const cell = this.getCell(coordinate[0], coordinate[1]);
            return cell?.type === CellStates.FOOD || false;
        });
        for (let food of this.foods) {
            foods.push(getCoordinateWithIndex(staticParameters().COLUMNS, food));
        }
        if (this.foods.length < 10) {
            this.setFood(Math.floor(Math.random() * staticParameters().COLUMNS), Math.floor(Math.random() *
                staticParameters().ROWS), Math.floor(Math.random() * 100));
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
