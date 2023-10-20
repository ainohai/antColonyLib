"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = exports.Home = exports.Agent = void 0;
class Agent {
    //spaceTaken: 0;
    constructor(location) {
        this.location = location;
    }
}
exports.Agent = Agent;
class Home extends Agent {
    constructor(location) {
        super(location);
    }
    deleteMe() {
        return false;
    }
}
exports.Home = Home;
class Food extends Agent {
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
exports.Food = Food;
