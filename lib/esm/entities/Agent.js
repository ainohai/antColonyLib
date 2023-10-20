export class Agent {
    location;
    //spaceTaken: 0;
    constructor(location) {
        this.location = location;
    }
}
export class Home extends Agent {
    constructor(location) {
        super(location);
    }
    deleteMe() {
        return false;
    }
}
export class Food extends Agent {
    amount;
    constructor(location, amount) {
        super(location);
        this.amount = amount;
    }
    reduceFood() {
        this.amount -= 1;
    }
    deleteMe() {
        return this.amount > 0;
    }
}
