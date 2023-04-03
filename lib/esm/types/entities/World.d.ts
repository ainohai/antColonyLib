import { CellStates, Coordinate, Direction } from '../types';
export declare class Cell {
    type: CellStates;
    foodPheremone: number;
    homePheremone: number;
    foodCount: number;
    touched: number;
    constructor();
    reduceFood(): void;
    touchPheromones(currentTick: number): void;
    addPheremone(stepsFromHome: number, stepsFromFood: number | undefined, currentTick: number): void;
}
export declare class AntWorld {
    cells: Cell[];
    home: number;
    foods: number[];
    constructor(columns: number, rows: number);
    getCell(x: number, y: number): (Cell | undefined);
    getHome(): Cell;
    getFoodCoordinates(): [number, number][];
    getHomeCoord(): Coordinate;
    private createCells;
    moveInTheWorld(location: Coordinate, directions: Direction): Coordinate;
    private setHome;
    private setFood;
}
//# sourceMappingURL=World.d.ts.map