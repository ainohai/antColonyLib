import { AgentType, Coordinate, Direction, PheremoneType } from '../types';
import { Agent } from "./Agent";
export declare class Cell {
    private capacity;
    private touched;
    private _pheremones;
    constructor();
    get pheremones(): {
        [key in PheremoneType]?: number;
    };
    touchPheromones(currentTick: number): void;
    boundPheremone(min: number, max: number, current: number, addition: number): number;
    addPheremone(pheremoneType: PheremoneType, startingStep: number, currentTick: number): void;
}
export declare class SimulationWorld {
    private cells;
    private agentsInCells;
    constructor(columns: number, rows: number);
    getCell(x: number, y: number): (Cell | undefined);
    getIndex(x: number, y: number): (number);
    getHome(): {
        [cellIndex: number]: Agent[];
    };
    getType(agentType: AgentType): Agent[];
    getTypeFromCell(agentType: AgentType, location: [number, number]): Agent[];
    getFoodCoordinates(): [number, number][];
    getHomeCoord(): Coordinate;
    private createCells;
    moveInTheWorld(location: Coordinate, directions: Direction): Coordinate;
    private setHome;
    setFood(x: number, y: number, amount: number): void;
    setAgent(x: number, y: number, agent: Agent, agentType: AgentType): void;
}
//# sourceMappingURL=World.d.ts.map