import { Coordinate } from "../types";
export declare abstract class Agent {
    location: Coordinate;
    constructor(location: Coordinate);
    abstract deleteMe(): boolean;
}
export declare class Home extends Agent {
    constructor(location: Coordinate);
    deleteMe(): boolean;
}
export declare class Food extends Agent {
    private amount;
    constructor(location: Coordinate, amount: number);
    reduceFood(): void;
    deleteMe(): boolean;
}
//# sourceMappingURL=Agent.d.ts.map