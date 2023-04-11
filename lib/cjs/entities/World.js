"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntWorld = exports.Cell = void 0;
const coordinateUtil_1 = require("../utils/coordinateUtil");
const antConfig_1 = require("../config/antConfig");
const types_1 = require("../types");
const MAX_CELL_PHEREMONE = 1;
class Cell {
    constructor() {
        this.type = types_1.CellStates.EMPTY;
        this.foodPheremone = 0;
        this.homePheremone = 0;
        this.foodCount = 0;
        //simulation cycle when pheromones were last calculated. 
        this.touched = 0;
    }
    reduceFood() {
        this.foodCount -= 1;
        if (this.foodCount === 0) {
            this.type = types_1.CellStates.EMPTY;
        }
    }
    touchPheromones(currentTick) {
        if (this.touched === currentTick) {
            return;
        }
        //Doesn't worry about concurrency. 
        const evaporationTime = currentTick - this.touched;
        const food = this.foodPheremone * (1 - (0, antConfig_1.antConfig)().foodPheremoneDecay * evaporationTime);
        const home = this.homePheremone * (1 - (0, antConfig_1.antConfig)().homePheremoneDecay * evaporationTime);
        this.foodPheremone = food > 0 ? food : 0;
        this.homePheremone = home > 0 ? home : 0;
        this.touched = currentTick;
    }
    addPheremone(stepsFromHome, stepsFromFood, currentTick) {
        this.touchPheromones(currentTick);
        if (!!stepsFromFood) {
            const foodPheremoneAdd = (0, antConfig_1.antConfig)().antPheremoneWeight * (1 - ((0, antConfig_1.antConfig)().antFoodPheremoneDecay * (stepsFromFood)));
            this.foodPheremone = this.foodPheremone + (foodPheremoneAdd > 0 ? foodPheremoneAdd : 0);
        }
        if (!!stepsFromHome) {
            const homePheremoneAdd = (0, antConfig_1.antConfig)().antPheremoneWeight * (1 - ((0, antConfig_1.antConfig)().antHomePheremoneDecay * stepsFromHome));
            this.homePheremone = this.homePheremone + (homePheremoneAdd > 0 ? homePheremoneAdd : 0);
        }
    }
}
exports.Cell = Cell;
class AntWorld {
    constructor(columns, rows) {
        this.cells = [];
        this.home = 0;
        this.foods = [];
        this.cells = [];
        this.createCells(columns, rows);
        this.setHome(Math.floor(columns / 2), Math.floor(rows / 2));
    }
    getCell(x, y) {
        let coordinate = (0, coordinateUtil_1.wrapCoordinateToWorld)((0, antConfig_1.staticParameters)().COLUMNS, (0, antConfig_1.staticParameters)().ROWS, [x, y]);
        return (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, (0, antConfig_1.staticParameters)().COLUMNS, coordinate[0], coordinate[1]);
    }
    getHome() {
        return this.cells[this.home];
    }
    getFoodCoordinates() {
        const foods = [];
        this.foods = this.foods.filter(index => {
            const coordinate = (0, coordinateUtil_1.getCoordinateWithIndex)((0, antConfig_1.staticParameters)().COLUMNS, index);
            const cell = this.getCell(coordinate[0], coordinate[1]);
            return (cell === null || cell === void 0 ? void 0 : cell.type) === types_1.CellStates.FOOD || false;
        });
        for (let food of this.foods) {
            foods.push((0, coordinateUtil_1.getCoordinateWithIndex)((0, antConfig_1.staticParameters)().COLUMNS, food));
        }
        if (this.foods.length < 10) {
            this.setFood(Math.floor(Math.random() * (0, antConfig_1.staticParameters)().COLUMNS), Math.floor(Math.random() *
                (0, antConfig_1.staticParameters)().ROWS), Math.floor(Math.random() * 100));
        }
        return foods;
    }
    getHomeCoord() {
        return (0, coordinateUtil_1.getCoordinateWithIndex)((0, antConfig_1.staticParameters)().COLUMNS, this.home);
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
        const totalColumn = (0, antConfig_1.staticParameters)().COLUMNS;
        const totalRows = (0, antConfig_1.staticParameters)().ROWS;
        (0, coordinateUtil_1.wrapCoordinateToWorld)(totalColumn, totalRows, location);
        location[0] = location[0] + directions.x;
        location[1] = location[1] + directions.y;
        return location;
    }
    setHome(x, y) {
        const cell = (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, (0, antConfig_1.staticParameters)().COLUMNS, x, y);
        if (!cell) {
            throw new Error(`Trying to set home to illegal point (${x},${y})`);
        }
        cell.type = types_1.CellStates.HOME;
        let homeIndex = (0, coordinateUtil_1.getIndexWithCoordinate)((0, antConfig_1.staticParameters)().COLUMNS, (0, antConfig_1.staticParameters)().ROWS, x, y);
        this.home = homeIndex;
    }
    setFood(x, y, amount) {
        const cell = (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, (0, antConfig_1.staticParameters)().COLUMNS, x, y);
        const index = (0, coordinateUtil_1.getIndexWithCoordinate)((0, antConfig_1.staticParameters)().COLUMNS, (0, antConfig_1.staticParameters)().ROWS, x, y);
        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`);
        }
        cell.type = types_1.CellStates.FOOD;
        cell.foodCount = amount;
        this.foods.push(index);
    }
}
exports.AntWorld = AntWorld;
