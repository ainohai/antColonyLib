import { getCoordinateWithIndex, getIndexWithCoordinate, getValueWithCoordinate, wrapCoordinateToWorld } from '../utils/coordinateUtil';
import { walkerConfig, staticParameters } from "../config/walkerConfig";
import { AgentType, Coordinate, Direction, Pheremone, PheremoneRules, PheremoneType, SimulationStatistics } from '../types';
import { Agent } from "./Agent";
import { Home, Food } from './Agent';

const MIN_CELL_PHEREMONE = 0.001;


export class Cell {

    private capacity: number = 1000 // How much stuff can be fit in the cell. Zero = wall. 
    private touched: number = 0; // When have pheremone levels last updated.
    addedOnTick= 0;
    pheremones: { [key in PheremoneType]?: number } = {}

    constructor() {
    }

    touchPheromones(currentTick: number) {
        if (this.touched === currentTick) {
            return;
        }

        this.addedOnTick = 0;

        //Doesn't worry about concurrency. 
        const evaporationTime = currentTick - this.touched;

        for (let [pheremone, value] of Object.entries(this.pheremones)) {
            const phe: PheremoneType = Number.parseInt(pheremone) as PheremoneType;
            if (!value) {
                continue;
            }
            else if (value < 0) {

                this.pheremones[phe] = 0;
            }
            else {

                const pher = value * (1 - walkerConfig().pheremoneRules[phe].cellDecay * evaporationTime);
                this.pheremones[phe] = pher >= MIN_CELL_PHEREMONE ? pher : 0;
                if (pher > 0) {
                    //console.log(this);
                }
            }
        }

        this.touched = currentTick;

    }
    boundPheremone(min: number, max: number, current: number, addition: number) {
        const pheremone = current + addition;
        /*if (pheremone > max) {
            return max;
        }
        else if (pheremone < min) {
            return min;
        }*/
        return pheremone;
    }

    reducePheremone(pheType: PheremoneType, startingStep: number, currentTick: number) {
        //this.touchPheromones(currentTick);

        const pheremoneRules: PheremoneRules = walkerConfig().pheremoneRules[pheType];
        let pheremoneAdd = pheremoneRules.weight *(pheremoneRules.walkerDecay * (currentTick - startingStep));
        pheremoneAdd = pheremoneAdd > 0 ? pheremoneAdd: 0;

        this.pheremones[pheType] = this.pheremones[pheType] - pheremoneAdd;
        this.pheremones[pheType] = this.pheremones[pheType] > 0 ? this.pheremones[pheType] : 0;
        //this.pheremones[pheType] = this.boundPheremone(0, pheremoneRules.maxPheremone, this.pheremones[pheType] ?? 0, pheremoneAdd);
    }

    addPheremone(pheType: PheremoneType, startingStep: number, currentTick: number) {
        this.touchPheromones(currentTick);

        if(this.addedOnTick > 0) {
            
                //this.reducePheremone(pheType === PheremoneType.SUGAR ? PheremoneType.HOME : PheremoneType.SUGAR, startingStep, currentTick);
                //this.addedOnTick += 1;
                //return;
            
        }

        const pheremoneRules: PheremoneRules = walkerConfig().pheremoneRules[pheType];
        let pheremoneAdd = pheremoneRules.weight * (1 - (pheremoneRules.walkerDecay * (currentTick - startingStep)));
        pheremoneAdd = pheremoneAdd > 0 ? pheremoneAdd : 0;

        //this.pheremones[pheType] = this.pheremones[pheType] ?? 0, pheremoneAdd;
        this.pheremones[pheType] = this.boundPheremone(0, pheremoneRules.maxPheremone, this.pheremones[pheType] ?? 0, pheremoneAdd);

        this.addedOnTick += 1;

    }
}

export class SimulationWorld {

    cells: Cell[] = [];
    private agentsInCells: { [key in AgentType]: { [cellIndex: number]: Agent[] } };
    private postHandleAgents = [AgentType.FOOD];

    constructor(columns: number, rows: number) {
        this.cells = [];

        this.createCells(columns, rows);

        let a: { [key in AgentType]?: { [cellIndex: number]: Agent[] } } = {};
        Object.keys(AgentType).forEach(enumVal => { const aType = Number.parseInt(enumVal) as AgentType; a[aType] = {} });

        this.agentsInCells = a as { [key in AgentType]: { [cellIndex: number]: Agent[] } };

        this.setHome(Math.floor(columns / 2), Math.floor(rows / 2));
    }

    getCell(x: number, y: number): (Cell | undefined) {
        let coordinate = wrapCoordinateToWorld(staticParameters().COLUMNS, staticParameters().ROWS, [x, y])
        return getValueWithCoordinate(this.cells, staticParameters().COLUMNS, coordinate[0], coordinate[1]);
    }

    getIndex(x: number, y: number): (number | undefined) {

        let [xFixed, yFixed] = wrapCoordinateToWorld(staticParameters().COLUMNS, staticParameters().ROWS, [x, y])
        const locationIndex = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, xFixed, yFixed);

        return locationIndex;
    }

    getHome() {
        return this.agentsInCells[AgentType.HOME];
    }

    getType(agentType: AgentType): Agent[] {

        const agents = this.agentsInCells[agentType as AgentType];
        if (!agents) {
            return [];
        }
        return Object.values(agents).flatMap(t => t);
    }

    getTypeFromCell(agentType: AgentType, location: [number, number]) {
        const locationIndex = this.getIndex(location[0], location[1]);
        if (!locationIndex) {
            return [];
        }

        const agentsByType = this.agentsInCells[agentType] ?? {}
        const agents: Agent[] = agentsByType[locationIndex] ?? [];

        return agents;
    }

    //ensure removal
    getFoodIndexes(): Coordinate[] {

        const foodsWithIndexes = this.agentsInCells[AgentType.FOOD]

        return Object.keys(foodsWithIndexes).map(t => getCoordinateWithIndex(staticParameters().COLUMNS, Number.parseInt(t)))

    }

    getHomeIndexes(): Coordinate {
        const firstHome = Object.keys(this.getHome()).map(Number)[0];

        return getCoordinateWithIndex(staticParameters().COLUMNS, firstHome);
    }

    endTurn() {

        let count = 0;

        for (const agentType of this.postHandleAgents) {

            const agentWithIndexes = this.agentsInCells[agentType];
            if (!agentWithIndexes) {
                continue;
            }



            for (const [index, agents] of Object.entries(this.agentsInCells[agentType as AgentType])) {

                this.agentsInCells[agentType][index] = agents.filter(t => !t.deleteMe());

                count += agents.length;

                if (this.agentsInCells[agentType][index].length === 0) {
                    delete this.agentsInCells[agentType][index];
                }
            }
        }

        if (count < 20) {
            this.setFood(Math.floor(Math.random() * staticParameters().COLUMNS), Math.floor(Math.random() *
                staticParameters().ROWS), Math.floor(Math.random() * 1000));
        }

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

        let homeIndex = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        const home = new Home([x, y]);
        this.agentsInCells[AgentType.HOME][homeIndex] = [home];

    }

    public setFood(x: number, y: number, amount: number) {
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);
        const index = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);

        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`)
        }

        const food = new Food([x, y], amount);
        this.agentsInCells[AgentType.FOOD][index] = [food];
    }

    public setAgent(x: number, y: number, agent: Agent, agentType: AgentType) {
        const index = getIndexWithCoordinate(staticParameters().COLUMNS, staticParameters().ROWS, x, y);
        const cell = getValueWithCoordinate(this.cells, staticParameters().COLUMNS, x, y);

        if (!cell || !index) {
            throw new Error(`Trying to set food to illegal point (${x},${y})`)
        }

        if (!this.agentsInCells[agentType][index]) {
            this.agentsInCells[agentType][index] = [agent];
        }
        else {
            this.agentsInCells[agentType][index].push(agent);
        }
    }

}