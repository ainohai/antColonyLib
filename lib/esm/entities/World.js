import { getCoordinateWithIndex, getIndexWithCoordinate, getValueWithCoordinate, wrapCoordinateToWorld } from '../utils/coordinateUtil';
import { walkerConfig, staticParameters } from "../config/walkerConfig";
import { AgentType, PheremoneType } from '../types';
import { Home, Food } from './Agent';
const MAX_CELL_PHEREMONE = 1;
export class Cell {
    capacity = 1000; // How much stuff can be fit in the cell. Zero = wall. 
    touched = 0; // When have pheremone levels last updated.
    _pheremones = {};
    constructor() {
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
                const pher = value * (1 - walkerConfig().pheremoneRules[pheType].walkerDecay * evaporationTime);
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
        this.touchPheromones(currentTick);
        for (let [pheremone, value] of Object.entries(this.pheremones)) {
            const pheType = Number.parseInt(pheremone);
            const pheremoneRules = walkerConfig().pheremoneRules[pheType];
            let pheremoneAdd = pheremoneRules.weight * (1 - (pheremoneRules.walkerDecay * (currentTick - startingStep)));
            pheremoneAdd = pheremoneAdd > 0 ? pheremoneAdd : 0;
            this.pheremones[PheremoneType.SUGAR] = this.boundPheremone(0, pheremoneRules.maxPheremone, this.pheremones[PheremoneType.SUGAR] ?? 0, pheremoneAdd);
        }
    }
}
export class SimulationWorld {
    cells = [];
    agentsInCells;
    constructor(columns, rows) {
        this.cells = [];
        this.createCells(columns, rows);
        let a = {};
        Object.keys(AgentType).forEach(enumVal => { const aType = Number.parseInt(enumVal); a[aType] = {}; });
        this.agentsInCells = a;
        this.setHome(Math.floor(columns / 2), Math.floor(rows / 2));
    }
    getCell(x, y) {
        let coordinate = wrapCoordinateToWorld(staticParameters().COLUMNS, staticParameters().ROWS, [x, y]);
        return getValueWithCoordinate(this.cells, staticParameters().COLUMNS, coordinate[0], coordinate[1]);
    }
    getIndex(x, y) {
        const locationIndex = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        if (locationIndex === undefined) {
            throw ("Illegal index");
        }
        return locationIndex;
    }
    getHome() {
        return this.agentsInCells[AgentType.HOME];
    }
    getType(agentType) {
        const agents = this.agentsInCells[agentType];
        if (!agents) {
            return [];
        }
        return Object.values(agents).flatMap(t => t);
    }
    getTypeFromCell(agentType, location) {
        const locationIndex = this.getIndex(location[0], location[1]);
        const agentsByType = this.agentsInCells[agentType] ?? {};
        const agents = agentsByType[locationIndex] ?? [];
        // Removes agents we wont need anymore.
        agentsByType[locationIndex] = agents.filter(t => !t.deleteMe());
        return agents;
    }
    //ensure removal
    getFoodCoordinates() {
        const foods = [];
        const keys = Object.keys(this.agentsInCells[AgentType.FOOD]);
        const values = Object.values(this.agentsInCells[AgentType.FOOD]);
        const foodIndexes = keys.map(Number);
        for (let food of foodIndexes) {
            foods.push(getCoordinateWithIndex(staticParameters().COLUMNS, food));
        }
        const agents = Object.values(values).flatMap(t => t);
        if (agents.length < 12) {
            this.setFood(Math.floor(Math.random() * staticParameters().COLUMNS), Math.floor(Math.random() *
                staticParameters().ROWS), Math.floor(Math.random() * 1000));
        }
        return foods;
    }
    getHomeCoord() {
        const firstHome = Object.keys(this.getHome()).map(Number)[0];
        return getCoordinateWithIndex(staticParameters().COLUMNS, firstHome);
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
        let homeIndex = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        const home = new Home([x, y]);
        this.agentsInCells[AgentType.HOME][homeIndex] = [home];
    }
    setFood(x, y, amount) {
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);
        const index = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`);
        }
        const food = new Food([x, y], amount);
        this.agentsInCells[AgentType.FOOD][index] = [food];
    }
    setAgent(x, y, agent, agentType) {
        const index = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);
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
