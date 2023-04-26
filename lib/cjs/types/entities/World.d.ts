import { CellStates, Coordinate, Direction, PheremoneType } from '../types';
export declare class Cell {
    type: CellStates;
    foodCount: number;
    touched: number;
    homePheremone: number;
    foodPheremone: number;
    constructor();
    reduceFood(): void;
    touchPheromones(currentTick: number): void;
    boundPheremone(min: number, max: number, current: number, addition: number): number;
    addPheremone(pheremoneType: PheremoneType, startingStep: number, currentTick: number): void;
}
export declare class AntWorld {
    cells: Cell[];
    home: number;
    private foods;
    constructor(columns: number, rows: number);
    getCell(x: number, y: number): (Cell | undefined);
    getHome(): Cell;
    getFoodCoordinates(): [number, number][];
    getHomeCoord(): Coordinate;
    private createCells;
    moveInTheWorld(location: Coordinate, directions: Direction): Coordinate;
    private setHome;
    setFood(x: number, y: number, amount: number): void;
}
//# sourceMappingURL=World.d.ts.map