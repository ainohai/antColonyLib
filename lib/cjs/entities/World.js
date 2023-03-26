"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntWorld = exports.Cell = void 0;
const coordinateUtil_1 = require("../utils/coordinateUtil");
const antConfig_1 = require("../antConfig");
class Cell {
    constructor() {
        this.type = antConfig_1.CellStates.EMPTY;
        this.foodPheremone = 0;
        this.homePheremone = 0;
        this.foodCount = 0;
        //simulation cycle when pheromones were last calculated. 
        this.touched = 0;
    }
    reduceFood() {
        this.foodCount -= 1;
        if (this.foodCount === 0) {
            this.type = antConfig_1.CellStates.EMPTY;
        }
    }
    touchPheromones(currentTick) {
        if (this.touched === currentTick) {
            return;
        }
        //Doesn't have to worry about concurrency. 
        this.touched = currentTick;
        const evaporationTime = currentTick - this.touched;
        this.foodPheremone = this.foodPheremone - (this.foodPheremone * antConfig_1.antConfig.foodPheremoneDecay * evaporationTime);
        this.homePheremone = this.homePheremone - (this.homePheremone * antConfig_1.antConfig.homePheremoneDecay * evaporationTime);
    }
    addPheremone(stepsFromHome, stepsFromFood, currentTick) {
        this.touchPheromones(currentTick);
        if (!!stepsFromFood) {
            this.foodPheremone = this.foodPheremone + (antConfig_1.antConfig.foodDistanceFactor / stepsFromFood);
        }
        this.homePheremone = this.homePheremone + (antConfig_1.antConfig.homeDistanceFactor / stepsFromHome);
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
        this.setFood(Math.floor(columns / 2) + 135, Math.floor(rows / 2) + 135, 1000);
    }
    getCell(x, y) {
        let coordinate = (0, coordinateUtil_1.wrapCoordinateToWorld)(antConfig_1.staticParameters.COLUMNS, antConfig_1.staticParameters.ROWS, [x, y]);
        return (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, antConfig_1.staticParameters.COLUMNS, coordinate[0], coordinate[1]);
    }
    getHome() {
        return this.cells[this.home];
    }
    getFoodCoordinates() {
        const foods = [];
        for (let food of this.foods) {
            foods.push((0, coordinateUtil_1.getCoordinateWithIndex)(antConfig_1.staticParameters.COLUMNS, food));
        }
        return foods;
    }
    getHomeCoord() {
        return (0, coordinateUtil_1.getCoordinateWithIndex)(antConfig_1.staticParameters.COLUMNS, this.home);
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
        const totalColumn = antConfig_1.staticParameters.COLUMNS;
        const totalRows = antConfig_1.staticParameters.ROWS;
        (0, coordinateUtil_1.wrapCoordinateToWorld)(totalColumn, totalRows, location);
        location[0] = location[0] + directions.x;
        location[1] = location[1] + directions.y;
        return location;
    }
    setHome(x, y) {
        const cell = (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, antConfig_1.staticParameters.COLUMNS, x, y);
        if (!cell) {
            throw new Error(`Trying to set home to illegal point (${x},${y})`);
        }
        cell.type = antConfig_1.CellStates.HOME;
        let homeIndex = (0, coordinateUtil_1.getIndexWithCoordinate)(antConfig_1.staticParameters.COLUMNS, antConfig_1.staticParameters.ROWS, x, y);
        this.home = homeIndex;
    }
    setFood(x, y, amount) {
        const cell = (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, antConfig_1.staticParameters.COLUMNS, x, y);
        const index = (0, coordinateUtil_1.getIndexWithCoordinate)(antConfig_1.staticParameters.COLUMNS, antConfig_1.staticParameters.ROWS, x, y);
        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`);
        }
        cell.type = antConfig_1.CellStates.FOOD;
        cell.foodCount = amount;
        this.foods.push(index);
    }
}
exports.AntWorld = AntWorld;
