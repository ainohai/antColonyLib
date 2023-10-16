"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationWorld = exports.Cell = void 0;
const coordinateUtil_1 = require("../utils/coordinateUtil");
const walkerConfig_1 = require("../config/walkerConfig");
const types_1 = require("../types");
const Agent_1 = require("./Agent");
const MAX_CELL_PHEREMONE = 1;
class Cell {
    constructor() {
        this.capacity = 1000; // How much stuff can be fit in the cell. Zero = wall. 
        this.touched = 0; // When have pheremone levels last updated.
        this._pheremones = {};
    }
    get pheremones() {
        return this._pheremones;
    }
    touchPheromones(currentTick) {
        if (this.touched === currentTick) {
            return;
        }
        //Doesn't worry about concurrency. 
        const evaporationTime = currentTick - this.touched;
        for (let [pheremone, value] of Object.entries(this.pheremones)) {
            if (!value) {
                continue;
            }
            else if (value < 0) {
                const phe = Number.parseInt(pheremone);
                this.pheremones[phe] = 0;
            }
            else {
                const pheType = Number.parseInt(pheremone);
                const pher = value * (1 - (0, walkerConfig_1.walkerConfig)().pheremoneRules[pheType].walkerDecay * evaporationTime);
                this.pheremones[pheType] = pher > 0 ? pher : 0;
            }
        }
        this.touched = currentTick;
    }
    boundPheremone(min, max, current, addition) {
        const pheremone = current + addition;
        if (pheremone > max) {
            return max;
        }
        //Todo: why is this here?
        else if (pheremone < min) {
            return min;
        }
        return pheremone;
    }
    addPheremone(pheremoneType, startingStep, currentTick) {
        var _a;
        this.touchPheromones(currentTick);
        for (let [pheremone, value] of Object.entries(this.pheremones)) {
            const pheType = Number.parseInt(pheremone);
            const pheremoneRules = (0, walkerConfig_1.walkerConfig)().pheremoneRules[pheType];
            let pheremoneAdd = pheremoneRules.weight * (1 - (pheremoneRules.walkerDecay * (currentTick - startingStep)));
            pheremoneAdd = pheremoneAdd > 0 ? pheremoneAdd : 0;
            this.pheremones[types_1.PheremoneType.SUGAR] = this.boundPheremone(0, pheremoneRules.maxPheremone, (_a = this.pheremones[types_1.PheremoneType.SUGAR]) !== null && _a !== void 0 ? _a : 0, pheremoneAdd);
        }
    }
}
exports.Cell = Cell;
class SimulationWorld {
    constructor(columns, rows) {
        this.cells = [];
        this.cells = [];
        this.createCells(columns, rows);
        let a = {};
        Object.keys(types_1.AgentType).forEach(enumVal => { const aType = Number.parseInt(enumVal); a[aType] = {}; });
        this.agentsInCells = a;
        this.setHome(Math.floor(columns / 2), Math.floor(rows / 2));
    }
    getCell(x, y) {
        let coordinate = (0, coordinateUtil_1.wrapCoordinateToWorld)((0, walkerConfig_1.staticParameters)().COLUMNS, (0, walkerConfig_1.staticParameters)().ROWS, [x, y]);
        return (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, (0, walkerConfig_1.staticParameters)().COLUMNS, coordinate[0], coordinate[1]);
    }
    getIndex(x, y) {
        const locationIndex = (0, coordinateUtil_1.getIndexWithCoordinate)((0, walkerConfig_1.staticParameters)().COLUMNS, (0, walkerConfig_1.staticParameters)().ROWS, x, y);
        if (locationIndex === undefined) {
            throw ("Illegal index");
        }
        return locationIndex;
    }
    getHome() {
        return this.agentsInCells[types_1.AgentType.HOME];
    }
    getType(agentType) {
        const agents = this.agentsInCells[agentType];
        if (!agents) {
            return [];
        }
        return Object.values(agents).flatMap(t => t);
    }
    getTypeFromCell(agentType, location) {
        var _a, _b;
        const locationIndex = this.getIndex(location[0], location[1]);
        const agentsByType = (_a = this.agentsInCells[agentType]) !== null && _a !== void 0 ? _a : {};
        const agents = (_b = agentsByType[locationIndex]) !== null && _b !== void 0 ? _b : [];
        // Removes agents we wont need anymore.
        agentsByType[locationIndex] = agents.filter(t => !t.deleteMe());
        return agents;
    }
    //ensure removal
    getFoodCoordinates() {
        const foods = [];
        const keys = Object.keys(this.agentsInCells[types_1.AgentType.FOOD]);
        const values = Object.values(this.agentsInCells[types_1.AgentType.FOOD]);
        const foodIndexes = keys.map(Number);
        for (let food of foodIndexes) {
            foods.push((0, coordinateUtil_1.getCoordinateWithIndex)((0, walkerConfig_1.staticParameters)().COLUMNS, food));
        }
        const agents = Object.values(values).flatMap(t => t);
        if (agents.length < 12) {
            this.setFood(Math.floor(Math.random() * (0, walkerConfig_1.staticParameters)().COLUMNS), Math.floor(Math.random() *
                (0, walkerConfig_1.staticParameters)().ROWS), Math.floor(Math.random() * 1000));
        }
        return foods;
    }
    getHomeCoord() {
        const firstHome = Object.keys(this.getHome()).map(Number)[0];
        return (0, coordinateUtil_1.getCoordinateWithIndex)((0, walkerConfig_1.staticParameters)().COLUMNS, firstHome);
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
        const totalColumn = (0, walkerConfig_1.staticParameters)().COLUMNS;
        const totalRows = (0, walkerConfig_1.staticParameters)().ROWS;
        (0, coordinateUtil_1.wrapCoordinateToWorld)(totalColumn, totalRows, location);
        location[0] = location[0] + directions.x;
        location[1] = location[1] + directions.y;
        return location;
    }
    setHome(x, y) {
        const cell = (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, (0, walkerConfig_1.staticParameters)().COLUMNS, x, y);
        if (!cell) {
            throw new Error(`Trying to set home to illegal point (${x},${y})`);
        }
        let homeIndex = (0, coordinateUtil_1.getIndexWithCoordinate)((0, walkerConfig_1.staticParameters)().COLUMNS, (0, walkerConfig_1.staticParameters)().ROWS, x, y);
        const home = new Agent_1.Home([x, y]);
        this.agentsInCells[types_1.AgentType.HOME][homeIndex] = [home];
    }
    setFood(x, y, amount) {
        const cell = (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, (0, walkerConfig_1.staticParameters)().COLUMNS, x, y);
        const index = (0, coordinateUtil_1.getIndexWithCoordinate)((0, walkerConfig_1.staticParameters)().COLUMNS, (0, walkerConfig_1.staticParameters)().ROWS, x, y);
        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`);
        }
        const food = new Agent_1.Food([x, y], amount);
        this.agentsInCells[types_1.AgentType.FOOD][index] = [food];
    }
    setAgent(x, y, agent, agentType) {
        const index = (0, coordinateUtil_1.getIndexWithCoordinate)((0, walkerConfig_1.staticParameters)().COLUMNS, (0, walkerConfig_1.staticParameters)().ROWS, x, y);
        const cell = (0, coordinateUtil_1.getValueWithCoordinate)(this.cells, (0, walkerConfig_1.staticParameters)().COLUMNS, x, y);
        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`);
        }
        if (!this.agentsInCells[agentType][index]) {
            this.agentsInCells[agentType][index] = [agent];
        }
        else {
            this.agentsInCells[agentType][index].push(agent);
        }
    }
}
exports.SimulationWorld = SimulationWorld;
