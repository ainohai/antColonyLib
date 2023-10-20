import { Coordinate } from "../types";


export abstract class Agent {

    location: Coordinate;
    //spaceTaken: 0;

    constructor(location: Coordinate) {
        this.location = location;
    }

    // Returns true if object should be deleted;
    abstract deleteMe(): boolean;
}
export class Home extends Agent {
    constructor(location: Coordinate) {
        super(location);
    }
    deleteMe(): boolean {
        return false;
    }
}

export class Food extends Agent {
    private amount: number;

    constructor(location: Coordinate, amount: number) {
        super(location);
        this.amount = amount;
    }
    reduceFood() {
        if (this.amount > 0) {
            this.amount -= 1;
            return true;
        }
        return false;
    }
    deleteMe() {
        return this.amount <= 0;
    }
}

